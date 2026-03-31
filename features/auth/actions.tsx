import { db } from "@/lib/firebase";
import { getErrorMessageFromCode } from "@/lib/utils";
import {
  deleteUser,
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

export async function updateUserName(userId: string, newName: string) {
  try {
    const userRef = doc(db, "users", userId as string);
    await updateDoc(userRef, {
      fullName: newName,
      updatedAt: new Date().toISOString(),
    });

    return { success: true, message: "Name updated successfully!" };
  } catch (error) {
    console.error(error, "Name updated unsuccessfully!");
    return { success: false, message: "Failed to update name" };
  }
}
export async function updateUserPassword(
  currentPassword: string,
  newPassword: string,
) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      return { success: false, message: "User not authenticated" };
    }
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);

    return { success: true, message: "Password updated successfully" };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message:
        getErrorMessageFromCode(error.code) || "Failed to update password",
    };
  }
}
export async function deleteUserAccount(currentPassword: string) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      return { success: false, message: "User not authenticated" };
    }
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword,
    );
    await reauthenticateWithCredential(user, credential);
    await updateDoc(doc(db, "users", user.uid), {
      updatedAt: new Date().toISOString(),
      deletedAt: new Date().toISOString(),
      status: "deleted",
    });
    await deleteUser(user);
    await auth.signOut();

    return { success: true, message: "Account deleted successfully" };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      message:
        getErrorMessageFromCode(error.code) || "Failed to delete account",
    };
  }
}
