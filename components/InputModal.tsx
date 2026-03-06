import { X } from "lucide-react";
import { useState } from "react";

interface ModalProps {
  setOpenModal: (show: boolean) => void;
  title: string;
  firstInputLabel: string;
  secondInputLabel: string;
  btnLabel: string;
  onSubmitAction: (data: { field1: string; field2: string }) => void;
}

export const InputModal = ({
  setOpenModal,
  title,
  firstInputLabel,
  secondInputLabel,
  btnLabel,
  onSubmitAction,
}: ModalProps) => {
  const [formData, setFormData] = useState({
    field1: "",
    field2: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitAction) onSubmitAction(formData);
    setOpenModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl relative w-full max-w-md max-h-[90vh] ">
        <h2 className="text-xl text-slate-800 text-center font-bold mb-6 capitalize">
          {title}
        </h2>

        <button
          onClick={() => setOpenModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">
              {firstInputLabel}
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all"
              value={formData.field1}
              onChange={(e) =>
                setFormData({ ...formData, field1: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">
              {secondInputLabel}
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all"
              value={formData.field2}
              onChange={(e) =>
                setFormData({ ...formData, field2: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-black hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm"
          >
            {btnLabel}
          </button>
        </form>
      </div>
    </div>
  );
};
