"use server";
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
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

export async function createColumn({ title, order, workspaceId }: Column) {
  try {
    await addDoc(collection(db, "column"), {
      title,
      order,
      workspaceId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { success: true, message: "Column created successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to create column" };
  }
}
export const updateColumn = async ({
  title,
  order,
  columnId,
  workspaceId,
}: Column) => {
  try {
    const workspaceRef = doc(db, "column", columnId as string);
    await updateDoc(workspaceRef, {
      title: title,
      order: order,
      updatedAt: new Date().toISOString(),
    });

    return { success: true, message: "Column updated successfully!" };
  } catch (error) {
    console.error(error, "Column updated unsuccessfully!");
    return { success: false, message: "Failed to update column" };
  }
};

export const deleteColumn = async (id: string) => {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("columnId", "==", id));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);

    snapshot.forEach((taskDoc) => {
      batch.delete(taskDoc.ref);
    });

    const columnRef = doc(db, "column", id);
    batch.delete(columnRef);

    await batch.commit();

    return { success: true, message: "Column deleted!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Delete failed" };
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

    const columns = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return columns;
  } catch (error) {
    console.error("Error fetching columns:", error);
    return [];
  }
};
export async function updateColumnOrders(columns: Column[]) {
  try {
    const batch = writeBatch(db);
    columns.forEach((col, index) => {
      const ref = doc(db, "column", col.id as string);

      batch.update(ref, {
        order: index + 1,
      });
    });

    await batch.commit();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
