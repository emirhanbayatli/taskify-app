"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "sonner";
import { getErrorMessageFromCode } from "@/lib/utils";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthContextType, UserType } from "@/lib/types";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        setUser({
          email: firebaseUser.email,
          id: firebaseUser.uid,
          fullName: userData?.fullName || "",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
    } catch (err: any) {
      toast.error(getErrorMessageFromCode(err.code));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const user = await createUserWithEmailAndPassword(auth, email, password);

      const currentUserId = user.user.uid;

      await setDoc(doc(db, "users", currentUserId), {
        email: email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        image: "", // TODO: Add default image URL here and add a dynamic image link upload feature in the future
        fullName: fullName,
        role: "user",
      });

      toast.success("Account created successfully!");
    } catch (err: any) {
      console.log(err);
      toast.error(getErrorMessageFromCode(err.code));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
    } catch (err: any) {
      toast.error(getErrorMessageFromCode(err.code));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset password link sent successfully!");
    } catch (err: any) {
      toast.error(getErrorMessageFromCode(err.code));
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const firebaseUser = result.user;

      if (!firebaseUser) return;

      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      let fullName = "";

      if (!userSnap.exists()) {
        fullName = firebaseUser.displayName || "";

        await setDoc(userRef, {
          fullName,
          email: firebaseUser.email,
          createdAt: new Date(),
          updatedAt: new Date().toISOString(),
          image: "", // TODO: Add default image URL here and add a dynamic image link upload feature in the future
          role: "user",
        });
      } else {
        fullName = userSnap.data()?.fullName || "";
      }

      setUser({
        email: firebaseUser.email,
        id: firebaseUser.uid,
        fullName,
      });

      toast.success("Logged in with Google successfully!");
    } catch (err: any) {
      toast.error(getErrorMessageFromCode(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signUp,
        logout,
        resetPassword,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
