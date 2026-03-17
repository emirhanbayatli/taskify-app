"use server";
import { db } from "@/lib/firebase";
import { Member } from "@/lib/types";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export async function addMembersToWorkspace({
  workspaceId,
  member,
}: {
  workspaceId: string;
  member: Member;
}) {
  try {
    const workspaceRef = doc(db, "workspace", workspaceId);
    await updateDoc(workspaceRef, {
      members: arrayUnion(member),
      memberIds: arrayUnion(member.id),
    });
    return { success: true, message: "Member added successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add member" };
  }
}
export async function addMemberToTask({
  taskId,
  member,
}: {
  taskId: string;
  member: Member;
}) {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      members: arrayUnion(member),
      memberIds: arrayUnion(member.id),
    });
    return { success: true, message: "Member added successfully!" };
  } catch (error) {
    console.error(error, "Failed to add member");
    return { success: false, message: "Failed to add member" };
  }
}

export async function getUserWithEmail(email: string) {
  try {
    const userRef = collection(db, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const userDoc = querySnapshot.docs[0];
    const data = userDoc.data();

    return {
      id: userDoc.id,
      ...data,
    } as Member;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserWithId(id: string) {
  try {
    const docRef = doc(db, "users", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    const data = snapshot.data();

    return {
      id: snapshot.id,
      ...data,
    } as Member;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const createInvitation = async (
  email: string,
  workspaceId: string,
  invitedBy: string,
) => {
  try {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 2);

    const inviteRef = await addDoc(collection(db, "invites"), {
      email,
      workspaceId,
      invitedBy,
      token,
      status: "pending",
      expiresAt: expiresAt,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      token,
      inviteId: inviteRef.id,
      expiresAt: expiresAt.toISOString(),
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Invitation could not be created" };
  }
};

export async function updateInvitationStatus(userId: string, inviteId: string) {
  try {
    await updateDoc(doc(db, "invites", inviteId), {
      status: "accepted",
      acceptedBy: userId,
      acceptedAt: new Date(),
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function removeMemberToWorkspace(
  memberId: string,
  workspaceId: string,
) {
  try {
    const workspaceRef = doc(db, "workspace", workspaceId);

    const docSnap = await getDoc(workspaceRef);
    if (!docSnap.exists())
      return { success: false, message: "Workspace not found" };

    const data = docSnap.data();

    const updatedMembers = data.members.filter((m: any) => m.id !== memberId);

    await updateDoc(workspaceRef, {
      members: updatedMembers,
      memberIds: arrayRemove(memberId),
    });

    return { success: true, message: "Member removed from workspace" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to remove member" };
  }
}

export async function removeMemberToTask(member: Member, taskId: string) {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const snap = await getDoc(taskRef);
    const data = snap.data();

    const updatedMembers = data?.members.filter(
      (member: Member) => member.id !== member.id,
    );

    await updateDoc(taskRef, {
      members: updatedMembers,
      memberIds: arrayRemove(member.id),
    });

    return { success: true, message: "Member removed from task" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to remove member" };
  }
}
