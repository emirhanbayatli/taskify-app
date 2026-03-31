"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthProvider";
import { MailOpen, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  addMembersToWorkspace,
  updateInvitationStatus,
} from "@/features/members/actions";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function Invite() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [inviteData, setInviteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user && !loading) {
      router.push(`/login?callbackUrl=/invite?token=${token}`);
    }
  }, [token, router, loading, user]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      try {
        const q = query(
          collection(db, "invites"),
          where("token", "==", token),
          where("status", "==", "pending"),
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setInviteData({
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
          });
        } else {
          toast.error("Invalid or already used invitation.");
        }
      } catch (err) {
        toast.error("Verification failed.");
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleJoin = async () => {
    if (!user || !inviteData) return;
    setIsJoining(true);

    try {
      await addMembersToWorkspace({
        workspaceId: inviteData.workspaceId,
        member: {
          id: user.id || "",
          fullName: user.fullName || "",
          email: user.email || "",
        },
      });

      await updateInvitationStatus(user.id as string, inviteData.id);

      toast.success("Welcome! You have successfully joined.");
      router.push(`/workspace/${inviteData.workspaceId}`);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while joining.");
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Verifying invitation..." />;
  }

  if (!inviteData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border text-center max-w-sm">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">✕</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Invalid Link</h1>
          <p className="text-slate-500 mt-2 mb-6">
            This invitation link is expired or already used.
          </p>
          <Button
            onClick={() => router.push("/workspace")}
            variant="outline"
            className="bg-indigo-600 hover:bg-indigo-700 w-full"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 max-w-md w-full text-center">
        <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
          <MailOpen className="h-10 w-10 text-indigo-600 -rotate-3" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          You’ve Been Invited!
        </h1>

        <p className="text-slate-600 mt-4 mb-8 leading-relaxed">
          {inviteData?.senderName ? (
            <span>
              <strong>{inviteData.senderName}</strong> invited you to join their
              workspace.
            </span>
          ) : (
            "You have been invited to collaborate on a workspace."
          )}{" "}
          Ready to start working together?
        </p>

        <Button
          onClick={handleJoin}
          disabled={isJoining}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
        >
          {isJoining ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Joining...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Accept Invitation
            </>
          )}
        </Button>

        <p className="text-xs text-slate-400 mt-6 italic">
          Logged in as: {user?.email}
        </p>
      </div>
    </div>
  );
}
