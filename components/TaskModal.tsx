"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Task } from "@/lib/types";

interface TaskModalProps {
  setOpenModal: (show: boolean) => void;
  title: string;
  btnLabel: string;
  onSubmitAction: (data: Partial<Task>) => void;
  initialData?: Partial<Task>;
}

export const TaskModal = ({
  setOpenModal,
  title,
  btnLabel,
  onSubmitAction,
  initialData,
}: TaskModalProps) => {
  const [formData, setFormData] = useState({
    taskTitle: initialData?.taskTitle || "",
    description: initialData?.description || "",
    projectName: initialData?.projectName || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitAction) {
      onSubmitAction(formData);
    }
    setOpenModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl text-slate-800 font-bold mb-6 border-b pb-2">
          {title}
        </h2>

        <button
          onClick={() => setOpenModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">
              Task Title
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.taskTitle}
              onChange={(e) =>
                setFormData({ ...formData, taskTitle: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">
              Project Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.projectName}
              onChange={(e) =>
                setFormData({ ...formData, projectName: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors shadow-md"
            >
              {btnLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
