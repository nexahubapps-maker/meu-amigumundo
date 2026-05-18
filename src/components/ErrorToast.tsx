"use client";

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export const ErrorToast = ({ message, onClose }: ErrorToastProps) => {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 fade-in animate-fade-in">
      <div className="bg-white border-2 border-red-200 rounded-2xl px-6 py-4 shadow-lg flex items-center gap-3">
        <span className="text-2xl">❌</span>
        <p className="text-red-600 font-semibold text-sm">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>
    </div>
  );
};