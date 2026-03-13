import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
      <p className="text-slate-500 font-medium">{label}</p>
    </div>
  );
}
