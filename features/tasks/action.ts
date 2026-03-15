"use server";
import { db } from "@/lib/firebase";
import { Task } from "@/lib/types";
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
} from "firebase/firestore";

export async function createTask({
  taskTitle,
  description,
  workspaceId,
  projectName,
  columnId,
}: Task) {
  try {
    await addDoc(collection(db, "tasks"), {
      taskTitle,
      description,
      workspaceId,
      projectName,
      columnId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return { success: true, message: "Task created successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Task creation failed" };
  }
}

export const updateTask = async ({
  taskTitle,
  description,
  projectName,
  projectStatus,
  id,
}: Task) => {
  try {
    const taskRef = doc(db, "tasks", id as string);
    await updateDoc(taskRef, {
      taskTitle,
      description,
      projectName,
      projectStatus,
      updatedAt: new Date().toISOString(),
    });

    return { success: true, message: "Task updated successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Task update failed" };
  }
};

export const deleteTask = async (id: string) => {
  try {
    await deleteDoc(doc(db, "tasks", id));
    return { success: true, message: "Task deleted successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Task deletion failed" };
  }
};

export const getTaskWithId = async (id: string) => {
  try {
    const docRef = doc(db, "tasks", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        message: "Task not found",
        data: null,
      };
    }

    return {
      success: true,
      data: {
        id: docSnap.id,
        ...docSnap.data(),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while fetching the task",
      data: null,
    };
  }
};

export const getTaskByWorkspaceId = async (id: string) => {
  try {
    const taskRef = collection(db, "tasks");
    const q = query(taskRef, where("workspaceId", "==", id));
    const querySnapshot = await getDocs(q);

    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};
