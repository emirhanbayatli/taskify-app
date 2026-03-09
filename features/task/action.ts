import { db } from "@/lib/firebase";
import { Task } from "@/lib/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "sonner";

export async function createTask({
  taskTitle,
  description,
  workspaceId,
  projectName,
  columnId,
}: Task) {
  try {
    await addDoc(collection(db, "tasks"), {
      taskTitle: taskTitle,
      description: description,
      workspaceId: workspaceId,
      projectName: projectName,
      columnId: columnId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    toast.success("Task created successfully!");
  } catch (error) {
    toast.error("Task created unsuccessfully!");
    console.error(error, "Task created unsuccessfully!");
  }
}

export const updateTask = async ({
  taskTitle,
  description,
  workspaceId,
  projectName,
  projectStatus,
  taskId,
}: Task) => {
  try {
    const workspaceRef = doc(db, "tasks", taskId as string);
    await updateDoc(workspaceRef, {
      taskTitle: taskTitle,
      description: description,
      workspaceId: workspaceId,
      projectName: projectName,
      projectStatus: projectStatus,
      updatedAt: serverTimestamp(),
    });
    toast.success("Task updated successfully!");
  } catch (error) {
    console.error(error, "Task updated unsuccessfully!");
    toast.error("Task updated unsuccessfully!");
  }
};

export const deleteTask = async (id: string) => {
  try {
    await deleteDoc(doc(db, "task", id));
    toast.success("Task deleted successfully!");
  } catch (error) {
    toast.error("Task deleted unsuccessfully!");
  }
};

export const getTaskByWorkspaceId = async (id: string) => {
  try {
    const taskRef = collection(db, "tasks");
    const q = query(taskRef, where("workspaceId", "==", id));
    const querySnapshot = await getDocs(q);

    const task = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return task;
  } catch (error) {
    console.error("Error fetching task:", error);
    return [];
  }
};
