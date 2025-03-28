// components/SliderImage.tsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SliderImageProps {
  onClose: () => void;
}

const SliderImage: React.FC<SliderImageProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const images: string[] = [
    "/images/step1.png",
    "/images/step2.png",
    "/images/step3.png",
    "/images/step4.png",
  ];

  const texts: string[] = [
    "Step 1: Open a Tron wallet and click on TRON, which is positioned at the top left.",
    "Step 2: Now, click on Add Wallet.",
    "Step 3: Now, click on Import Wallet.",
    "Step 4: Paste the private key here and click on the Next button.",
  ];

  useEffect(() => {
    if (currentIndex === images.length - 1) {
      const timer = setTimeout(() => onClose(), 2000); // Auto-close popup
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [currentIndex, onClose]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? prevIndex : prevIndex + 1
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className=" flex flex-col items-center bg-gray-100Ī p-6 rounded-lg shadow-xl w-full max-w-md">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Step ${currentIndex + 1}`}
          className="w-full h-96 object-contain rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
        <motion.p
          key={currentIndex + "-text"}
          className="text-lg text-gray-700 mt-4 text-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {texts[currentIndex]}
        </motion.p>

        <button
          onClick={nextImage}
          className={`mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                      rounded-full shadow-lg hover:scale-105 transition-all duration-300 ${
                        currentIndex === images.length - 1
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
          disabled={currentIndex === images.length - 1}
        >
          {currentIndex === images.length - 1 ? "Completed ✔" : "Next →"}
        </button>
      </div>
    </motion.div>
  );
};

export default SliderImage;
