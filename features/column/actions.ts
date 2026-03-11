import { db } from "@/lib/firebase";
import { Column } from "@/lib/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "sonner";

export async function createColumn({ title, order, workspaceId }: Column) {
  try {
    await addDoc(collection(db, "column"), {
      title: title,
      order: order,
      workspaceId: workspaceId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    toast.success("Column created successfully!");
  } catch (error) {
    toast.error("Column created unsuccessfully!");
    console.error(error, "Column created unsuccessfully!");
  }
}

export const updateColumn = async ({ title, order, columnId }: Column) => {
  try {
    const workspaceRef = doc(db, "column", columnId as string);
    await updateDoc(workspaceRef, {
      title: title,
      order: order,
      updatedAt: serverTimestamp(),
    });
    toast.success("Column updated successfully!");
  } catch (error) {
    console.error(error, "Column updated unsuccessfully!");
    toast.error("Column updated unsuccessfully!");
  }
};

export const deleteColumn = async (id: string) => {
  try {
    await deleteDoc(doc(db, "column", id));
    toast.success("Column deleted successfully!");
  } catch (error) {
    toast.error("Column deleted unsuccessfully!");
  }
};
export const getColumnByWorkspaceId = async (id: string) => {
  try {
    const columnRef = collection(db, "column");
    const q = query(
      columnRef,
      where("workspaceId", "==", id),
      orderBy("order"),
    );
    const querySnapshot = await getDocs(q);

    const column = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return column;
  } catch (error) {
    console.error("Error fetching columns:", error);
    return [];
  }
};
