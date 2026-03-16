import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessageFromCode(code: string): string {
  switch (code) {
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/email-already-in-use":
      return "This email is already in use.";
    case "auth/invalid-email":
      return "Invalid email address format.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/missing-password":
      return "Please enter your password.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/invalid-login-credentials":
      return "Invalid email or password.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/internal-error":
      return "An internal error occurred. Please try again.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/popup-closed-by-user":
      return "The popup was closed before completing the sign in.";
    case "auth/popup-blocked":
      return "Popup was blocked by your browser.";
    case "auth/requires-recent-login":
      return "Please log in again to perform this action.";
    case "auth/invalid-credential":
      return "The provided credential is invalid. Please try again.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}
export const formatTaskDate = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);

  const d = date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const t = date.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${d} • ${t}`;
};
