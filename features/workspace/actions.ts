import { db } from "@/lib/firebase";
import { Member, Workspace } from "@/lib/types";
import {
  addDoc,
  arrayUnion,
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
import { getUserWithId } from "../members/actions";

export async function createWorkspace({
  ownerId,
  workspaceName,
  workspaceDesc,
}: Workspace) {
  try {
    const user = await getUserWithId(ownerId);
    console.log(user, "deneme");
    if (!user) {
      toast.error("User not found");
      return;
    }

    await addDoc(collection(db, "workspace"), {
      workspaceName: workspaceName,
      workspaceDesc: workspaceDesc,
      ownerId: ownerId,
      members: [
        {
          id: ownerId,
          email: user?.email || "",
          fullName: user?.fullName || "",
          avatar: user?.avatar || "",
        },
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    toast.success("Workspace created successfully!");
  } catch (error) {
    console.error(error, "Worksapce created unsuccessfully!");
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

export async function getWorkspaceIdsByMember(userId: string) {
  try {
    const snapshot = await getDocs(collection(db, "workspace"));
    const workspaceIds: string[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.members.some((member: Member) => member.id === userId)) {
        workspaceIds.push(doc.id);
      }
    });

    return workspaceIds;
  } catch (error) {
    console.error("Error fetching workspaceIds:", error);
    return [];
  }
}
