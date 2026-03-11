import { db } from "@/lib/firebase";
import { Workspace } from "@/lib/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "sonner";

export async function createWorkspace({
  ownerId,
  workspaceName,
  workspaceDesc,
}: Workspace) {
  try {
    await addDoc(collection(db, "workspace"), {
      workspaceName: workspaceName,
      workspaceDesc: workspaceDesc,
      ownerId: ownerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    toast.success("Workspace created successfully!");
  } catch (error) {
    toast.error("Worksapce created unsuccessfully!");
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
    await deleteDoc(doc(db, "workspace", id));
    toast.success("Workspace deleted successfully!");
  } catch (error) {
    toast.error("Worksapce deleted unsuccessfully!");
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
      workspaceName: workspaceName,
      workspaceDesc: workspaceDesc,
      updatedAt: serverTimestamp(),
    });
    toast.success("Workspace updated successfully!");
  } catch (error) {
    console.error(error, "Worksapce updated unsuccessfully!");
    toast.error("Worksapce updated unsuccessfully!");
  }
};
export async function getWorkspaceWithId(workspaceId: string) {
  try {
    const docRef = doc(db, "workspace", workspaceId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  } catch (error) {
    console.error("Workspace get unsuccessfully!", error);
    toast.error("Workspace get unsuccessfully!");
    return null;
  }
}
