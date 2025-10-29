"use client";

const ProModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-50">
          Pro Feature
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          This feature is available in the Pro version. Upgrade to unlock all advanced tools!
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProModal;
