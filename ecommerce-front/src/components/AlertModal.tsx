import React from "react";

interface AlertModalProps {
  message: string;
  onClose: () => void;
  onLogin: () => void;
}

/**
 * Modal shown when a guest user tries an action that requires authentication.
 * Used in Shop and Deals pages.
 */
const AlertModal: React.FC<AlertModalProps> = ({ message, onClose, onLogin }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    />

    {/* Dialog */}
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-5">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="#f97316" strokeWidth="2" />
          <path
            d="M12 8v4m0 4h.01"
            stroke="#f97316"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <h2 className="text-xl font-extrabold text-gray-900 text-center">
        You're not logged in
      </h2>
      <p className="text-gray-500 text-center text-sm leading-relaxed">
        {message}
      </p>

      <div className="flex flex-col w-full gap-3 mt-1">
        <button
          type="button"
          onClick={onLogin}
          className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition duration-200 shadow-md shadow-orange-200"
        >
          Go to Login
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium transition duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default AlertModal;
