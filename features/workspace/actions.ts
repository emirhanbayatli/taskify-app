"use server";
import { db } from "@/lib/firebase";
import { Member, Workspace } from "@/lib/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { getUserWithId } from "../members/actions";

export async function createWorkspace({
  ownerId,
  workspaceName,
  workspaceDesc,
}: Workspace) {
  try {
    const user = await getUserWithId(ownerId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    await addDoc(collection(db, "workspace"), {
      workspaceName,
      workspaceDesc,
      ownerId,
      members: [
        {
          id: ownerId,
          email: user?.email || "",
          fullName: user?.fullName || "",
          avatar: user?.avatar || "",
        },
      ],
      memberIds: [ownerId],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { success: true, message: "Workspace created successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Workspace creation failed" };
  }
}
export const getWorkspacesByOwner = async (ownerId: string) => {
  try {
    const workspaceRef = collection(db, "workspace");
    const q = query(workspaceRef, where("ownerId", "==", ownerId));
    const querySnapshot = await getDocs(q);

    const workspaces = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return workspaces;
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return [];
  }
};

export const deleteWorkspace = async (id: string) => {
  try {
    const batch = writeBatch(db);

    const columnsRef = collection(db, "column");
    const columnsQuery = query(columnsRef, where("workspaceId", "==", id));
    const columnsSnap = await getDocs(columnsQuery);

    const columnIds: string[] = [];

    for (const columnDoc of columnsSnap.docs) {
      const columnId = columnDoc.id;
      columnIds.push(columnId);

      const tasksRef = collection(db, "tasks");
      const tasksQuery = query(tasksRef, where("columnId", "==", columnId));
      const tasksSnap = await getDocs(tasksQuery);

      tasksSnap.forEach((taskDoc) => {
        batch.delete(taskDoc.ref);
      });

      batch.delete(columnDoc.ref);
    }

    const workspaceRef = doc(db, "workspace", id);
    batch.delete(workspaceRef);

    await batch.commit();

    return { success: true, message: "Workspace deleted with all data!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Delete failed" };
  }
};

export const updateWorkspace = async (
  id: string,
  workspaceName: string,
  workspaceDesc: string,
) => {
  try {
    const workspaceRef = doc(db, "workspace", id);
    await updateDoc(workspaceRef, {
      workspaceName,
      workspaceDesc,
      updatedAt: new Date().toISOString(),
    });
    return { success: true, message: "Workspace updated successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Update failed" };
  }
};
export async function getWorkspaceWithId(workspaceId: string) {
  try {
    const docRef = doc(db, "workspace", workspaceId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getWorkspaceIdsByMember(userId: string) {
  try {
    const snapshot = await getDocs(collection(db, "workspace"));
    const workspaceIds: string[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.members?.some((member: Member) => member.id === userId)) {
        workspaceIds.push(doc.id);
      }
    });

    return workspaceIds;
  } catch (error) {
    console.error(error);
    return [];
  }
}
