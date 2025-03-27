import React, { useState } from "react";
import { motion } from "framer-motion";
import Background from "./layout/Background";
import WalletConnector from "./wallet/WalletConnector";
import Dashboard from "./dashboard/Dashboard";

const Home: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletData, setWalletData] = useState<{
    address: string;
    method?: string;
    seedPhrase?: string;
  } | null>(null);


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const handleWalletConnected = (data: { address: string; method: string }) => {
    setWalletData(data);
    setIsWalletConnected(true);
  };

  const handleWalletCreated = (data: {
    address: string;
    seedPhrase: string;
  }) => {
    setWalletData(data);
    setIsWalletConnected(true);
  };

  const handleDisconnect = () => {
    setIsWalletConnected(false);
    setWalletData(null);
  };

  
  return (
    <div className="min-h-screen w-full overflow-hidden bg-black">
      {/* Animated background with circuit patterns */}
      <Background density="high" speed="fast" color="gradient" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-[1400px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {!isWalletConnected ? (
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-10 text-center"
              >
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                  Tron Wallet Connector
                </h1>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  A secure platform to connect, create, and manage your Tron
                  wallets with an intuitive, futuristic design
                </p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-full max-w-md"
              >
                <WalletConnector
                  onWalletConnected={handleWalletConnected}
                  onWalletCreated={handleWalletCreated}
                  isOpen={true}
                />
              </motion.div>
            </div>
          ) : (
            <Dashboard
              walletAddress={walletData?.address}
              walletBalance="1,234.56" // This would be fetched from an API in a real implementation
              currency="TRX"
            />
          )}
        </motion.div>
      </div>

      {/* Footer with disconnect option when wallet is connected */}
      {isWalletConnected && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 p-4 flex justify-center z-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-full text-sm font-medium transition-colors duration-200 border border-red-600/30"
          >
            Disconnect Wallet
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
