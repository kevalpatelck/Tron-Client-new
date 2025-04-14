import React, { useState } from "react";
import { motion } from "framer-motion";
import Background from "./layout/Background";
import WalletConnector from "./wallet/WalletConnector";
import Dashboard from "./dashboard/Dashboard";
import ConnectOptions from "./wallet/ConnectOptions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";


const Home: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletData, setWalletData] = useState<{
    address: string;
    method?: string;
    seedPhrase?: string;
  } | null>(null);

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [mainwalletAddress, setmainWalletAddress] = useState('');

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
console.log("object")

  const navigate = useNavigate();



  const connectWallet = async () => {
    const tronLink = (window as any).tronLink;
    const tronWeb = (window as any).tronWeb;
  
    if (!tronLink || !tronWeb) {
      alert("❌ TronLink is not installed. Please install it first.");
      return;
    }
  
    try {
      console.log("🔄 Requesting TronLink connection...");
  
      // Check if TronLink is locked (not connected)
      const requestFnString = tronLink.request?.toString();
  
      // If TrustWallet is connected, show alert and stop
      if (
        requestFnString?.includes("switch(d)") ||
        requestFnString?.includes("tron_requestAccounts")
      ) {
        alert("⚠️ TrustWallet is active. Please switch to TronLink extension.");
        return; // stop the flow and don’t show TrustWallet connection process
      }
  
      // If TronLink is locked, show alert to unlock it first
      if (requestFnString?.includes("this.doRequest")) {
        console.log("✅ TronLink detected, attempting to connect...");
      
        // Request connection from TronLink
        await tronLink.request({ method: "tron_requestAccounts" });
  
        if (tronWeb && tronWeb.defaultAddress.base58) {
          const address = tronWeb.defaultAddress.base58;
          console.log("✅ Wallet connected address:", address);
  
          setmainWalletAddress(address);
          setIsConnected(true);
          localStorage.setItem("mainWalletAddress", address);


          //set trx balance
          
          const balanceInSun = await window.tronWeb.trx.getBalance(address);
          const trx = window.tronWeb.fromSun(balanceInSun);
          // setTrxBalance(trx);
          localStorage.setItem("trxbalance",trx);
  
          const contract = await window.tronWeb
            .contract()
            .at("TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf");
          const balance = await contract.balanceOf(address).call();
          const usdt = window.tronWeb.toDecimal(balance) / 1e6;
         localStorage.setItem("usdt",usdt.toFixed(2))

          
          
        






  
          // 🔁 Redirect to dashboard
          navigate("/dashboard");
        } else {
          console.log("⚠️ TronLink is installed but no wallet is connected.");
          alert("Please open TronLink and connect your wallet.");
        }


      } else {
        alert("❌ Please unlock TronLink first.");
      }
    } catch (error) {
      console.error("❌ Error connecting to TronLink:", error);
      alert("Failed to connect to TronLink. Please try again.");
    }
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
                {/* <WalletConnector
                  onWalletConnected={handleWalletConnected}
                  onWalletCreated={handleWalletCreated}
                  isOpen={true}
                /> */}

                <CardContent className=" border-2px rounded-xl backdrop-blur-md flex flex-col bg-black/40 space-y-1.5 p-6 text-center pb-2">
              <ConnectOptions onConnect={connectWallet} />
            </CardContent>
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

      {/* {isWalletConnected && (
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
      )} */}



    </div>
  );
};

export default Home;
      {/* Footer with disconnect option when wallet is connected */}
