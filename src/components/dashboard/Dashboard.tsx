import React, { useState } from "react";
import { motion } from "framer-motion";
import WalletCard from "./WalletCard";
import QuickActions from "./QuickActions";
import TransactionHistory from "../transactions/TransactionHistory";
import { Dialog, DialogContent } from "../ui/dialog";
import Background from "../layout/Background";
import { DataRefetchProvider } from "../transactions/DataRefetchContext";

import SliderImage from "../SliderImage";


// const [showPopup, setShowPopup] = useState(false);



const SendTransaction = () => {
  return (
    <div className="p-6 bg-gray-900">
      <h2 className="text-xl font-bold text-white mb-4">Send Transaction</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Recipient Address</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Enter recipient address"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Amount</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="0.00"
          />
        </div>
        <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded font-medium text-white">
          Send TRX
        </button>
      </div>
    </div>
  );
};

const ReceiveTransaction = ({
  address = "TRX1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0",
}) => {
  return (
    <div className="p-6 bg-gray-900">
      <h2 className="text-xl font-bold text-white mb-4">Receive Transaction</h2>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-48 h-48 bg-white p-2 rounded">
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">QR Code</span>
          </div>
        </div>
        <div className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm overflow-hidden">
          <p className="truncate">{address}</p>
        </div>
        <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded font-medium text-white">
          Copy Address
        </button>
      </div>
    </div>
  );
};

interface DashboardProps {
  walletAddress?: string;
  walletBalance?: string;
  currency?: string;
}

const Dashboard = ({
  walletAddress = "TRX1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0",
  walletBalance = "1,234.56",
  currency = "TRX",
}: DashboardProps) => {
  const [activeSendDialog, setActiveSendDialog] = useState(false);
  const [activeReceiveDialog, setActiveReceiveDialog] = useState(false);
  const [subaccountRefreshTrigger, setSubaccountRefreshTrigger] = useState(0);

  const handleSend = () => setActiveSendDialog(true);
  const handleReceive = () => setActiveReceiveDialog(true);
  const handleSwap = () => console.log("Swap action triggered");
  const handleStake = () => console.log("Stake action triggered");

  // Refresh subaccounts when one is added
  const handleSubAccountAdded = () => {
    setSubaccountRefreshTrigger(prev => prev + 1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white p-6 overflow-x-hidden">
            {/* <Background density="high" speed="fast" color="gradient" /> */}

      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=70')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"></div>
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <header className="mb-8">
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Tron Wallet Dashboard
          </motion.h1>
          <motion.p className="text-gray-400 mt-2" variants={itemVariants}>
            Manage your Tron assets securely with our intuitive interface
          </motion.p>
        </header>

        {/* Main Wallet + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 mb-6">
          <motion.div variants={itemVariants}>
            <WalletCard
              // balance={walletBalance}
              // address={walletAddress}
              // currency={currency}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <QuickActions
              onSend={handleSend}
              onReceive={handleReceive}
              onSwap={handleSwap}
              onStake={handleStake}
              onSubAccountAdded={handleSubAccountAdded} // Pass refresh callback
            />
          </motion.div>
        </div>

        {/* Subaccount list or history component that listens to changes */}
        <motion.div variants={itemVariants}>
          <DataRefetchProvider>
          <TransactionHistory />
          </DataRefetchProvider>
        </motion.div>
      </motion.div>

      {/* Send Dialog */}
      <Dialog open={activeSendDialog} onOpenChange={setActiveSendDialog}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white max-w-md">
          <SendTransaction />
        </DialogContent>
      </Dialog>

      {/* Receive Dialog */}
      <Dialog open={activeReceiveDialog} onOpenChange={setActiveReceiveDialog}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white max-w-md">
          <ReceiveTransaction address={walletAddress} />
        </DialogContent>
      </Dialog>

      {/* {showPopup && <SliderImage onClose={() => setShowPopup(false)} />} */}
      
    </div>
  );
};

export default Dashboard;
