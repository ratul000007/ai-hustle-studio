"use client";

import { motion, AnimatePresence } from "framer-motion";

const ProModal = ({ show, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} // click outside to close
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex justify-center items-center z-50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-full text-center relative">
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProModal;
