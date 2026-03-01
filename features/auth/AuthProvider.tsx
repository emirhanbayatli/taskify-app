"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { toast } from "sonner";
import { getErrorMessageFromCode } from "@/lib/utils";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

type UserType = {
  email: string | null;
  id: string | null;
} | null;

type AuthContextType = {
  user: UserType;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ email: firebaseUser.email, id: firebaseUser.uid });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
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
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
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
      setLoading(true);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signUp,
        logout,
        resetPassword,
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
