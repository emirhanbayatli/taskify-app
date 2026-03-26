"use client";
import { useEffect, useState } from "react";
import { Plus, LayoutGrid, Users } from "lucide-react";
import { InputModal } from "@/components/InputModal";
import { Button } from "@/components/ui/button";
import { WorkspaceCard } from "@/components/WorkspaceCard";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  createWorkspace,
  getWorkspaceIdsByMember,
  getWorkspacesByOwner,
  getWorkspaceWithId,
} from "@/features/workspace/actions";
import { Workspace as WorkspaceType } from "@/lib/types";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "sonner";

export default function Workspace() {
  const [openModal, setOpenModal] = useState(false);
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<WorkspaceType[]>([]);
  const [memberWorkspaces, setMemberWorkspaces] = useState<WorkspaceType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [ownedResult, memberIds] = await Promise.all([
        getWorkspacesByOwner(user.id || "unknown"),
        getWorkspaceIdsByMember(user.id || "unknown"),
      ]);

      const ownedWorkspaces = ownedResult as WorkspaceType[];
      setWorkspaces(ownedWorkspaces);

      const ownedIds = new Set(
        ownedWorkspaces.map((workspace) => workspace.id),
      );

      const filteredMemberIds = memberIds.filter((id) => !ownedIds.has(id));

      const memberWorkspacePromises = filteredMemberIds.map((id) =>
        getWorkspaceWithId(id),
      );

      const memberResults = await Promise.all(memberWorkspacePromises);

      setMemberWorkspaces(memberResults.filter(Boolean) as WorkspaceType[]);
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  async function handleCreateWorkspace(data: {
    field1: string;
    field2: string;
  }) {
    const result = await createWorkspace({
      ownerId: user?.id || "unknown",
      workspaceName: data.field1,
      workspaceDesc: data.field2,
      members: [],
    });
    if (result.success) {
      toast.success(result.message);
      await fetchData();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Workspaces
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your projects and collaborate with your team.
            </p>
          </div>
          <Button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-95 px-6"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Workspace
          </Button>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading workspaces..." />
        ) : (
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
                <LayoutGrid className="h-5 w-5 text-indigo-600" />
                <h2 className="text-xl font-semibold text-slate-800">
                  My Workspaces
                </h2>
              </div>

              {workspaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workspaces.map((workspace) => (
                    <WorkspaceCard
                      key={workspace.id}
                      id={workspace.id || ""}
                      title={workspace.workspaceName}
                      description={
                        workspace.workspaceDesc || "No description provided."
                      }
                      onRefresh={fetchData}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
                  <p className="text-muted-foreground italic">
                    You haven't created any workspaces yet.
                  </p>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Shared With Me
                </h2>
              </div>

              {memberWorkspaces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {memberWorkspaces.map((workspace) => (
                    <WorkspaceCard
                      key={workspace.id}
                      id={workspace.id || ""}
                      title={workspace.workspaceName}
                      description={
                        workspace.workspaceDesc || "No description provided."
                      }
                      onRefresh={fetchData}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
                  <p className="text-muted-foreground italic">
                    No workspaces shared with you yet.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {openModal && (
        <InputModal
          setOpenModal={setOpenModal}
          title="Create New Workspace"
          firstInputLabel="Workspace Name"
          secondInputLabel="Description"
          btnLabel="Create Workspace"
          onSubmitAction={async (data) => {
            handleCreateWorkspace(data);
            setOpenModal(false);
          }}
        />
      )}
    </div>
  );
}
