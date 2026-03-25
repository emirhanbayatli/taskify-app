"use server";

import { db } from "@/lib/firebase";
import { Comment } from "@/lib/types";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

export async function addCommentToTask({ taskId, author, message }: Comment) {
  try {
    const taskRef = doc(db, "tasks", taskId as string);

    await updateDoc(taskRef, {
      comments: arrayUnion({
        author,
        message,
        updatedAt: new Date().toISOString(),
      }),
    });

    return { success: true, message: "Comment added successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Comment added failed" };
  }
}

export async function removeCommentToTask(commentId: string) {}
