"use server";

import { db } from "@/lib/firebase";
import { Comment } from "@/lib/types";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

export async function addCommentToTask({ taskId, author, message }: Comment) {
  try {
    const taskRef = doc(db, "tasks", taskId as string);

    await updateDoc(taskRef, {
      comments: arrayUnion({
        id: crypto.randomUUID(),
        author,
        message,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });

    return { success: true, message: "Comment added successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Comment added failed" };
  }
}

export async function deleteCommentFromTask(taskId: string, commentId: string) {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const taskSnap = await getDoc(taskRef);

    if (!taskSnap.exists()) {
      return { success: false, message: "Task not found" };
    }

    const data = taskSnap.data();
    const comments = data.comments || [];

    const updatedComments = comments.filter(
      (comment: Comment) => comment.id !== commentId,
    );

    await updateDoc(taskRef, {
      comments: updatedComments,
    });

    return { success: true, message: "Comment deleted" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Delete failed" };
  }
}

export async function updateCommentInTask(
  taskId: string,
  commentId: string,
  newMessage: string,
) {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const taskSnap = await getDoc(taskRef);

    if (!taskSnap.exists()) {
      return { success: false, message: "Task not found" };
    }

    const data = taskSnap.data();
    const comments = data.comments || [];

    const updatedComments = comments.map((comment: Comment) =>
      comment.id === commentId
        ? {
            ...comment,
            message: newMessage,
            updatedAt: new Date().toISOString(),
          }
        : comment,
    );

    await updateDoc(taskRef, {
      comments: updatedComments,
    });

    return { success: true, message: "Comment updated" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Update failed" };
  }
}
