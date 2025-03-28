import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ConnectOptions from "./ConnectOptions";
import CreateWalletFlow from "./CreateWalletFlow";
import { Wallet, Plus, CircuitBoard } from "lucide-react";
import { useNavigate } from "react-router-dom";


interface WalletConnectorProps {
  onWalletConnected?: (walletData: { address: string; method: string }) => void;
  onWalletCreated?: (walletData: {
    address: string;
    seedPhrase: string;
  }) => void;
  isOpen?: boolean;
}

const handleConnecttron = () => {
  console.log("ascascas");
};
const WalletConnector: React.FC<WalletConnectorProps> = ({
  onWalletConnected = () => {},
  onWalletCreated = () => {},
  isOpen = true,
}) => {
  const [activeView, setActiveView] = useState<"main" | "connect" | "create">(
    "main"
  );
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [mainwalletAddress, setmainWalletAddress] = useState("");

  const navigate = useNavigate();

  const connectWallet = async () => {
    const tronLink = (window as any).tronLink;
    if (!tronLink) {
      alert("❌ TronLink is not installed. Please install it first.");
      return;
    }

    try {
      console.log("🔄 Requesting TronLink connection...");
      await tronLink.request({ method: "tron_requestAccounts" });

      const tronWeb = (window as any).tronWeb;
      if (tronWeb && tronWeb.defaultAddress.base58) {
        const address = tronWeb.defaultAddress.base58;
        console.log("✅ Wallet connected:", address);
        setmainWalletAddress(address);
        setIsConnected(true);
        localStorage.setItem("mainWalletAddress", address);

        // 🔁 Redirect to dashboard
        navigate("/dashboard");
      } else {
        console.log("⚠️ TronLink is installed but no wallet is connected.");
        alert("Please open TronLink and connect your wallet.");
      }
    } catch (error) {
      console.error("❌ Error connecting to TronLink:", error);
      alert("Failed to connect to TronLink. Please try again.");
    }
  };
  
  

  // useEffect(() => {
  //   const savedAddress = sessionStorage.getItem("mainWalletAddress");
  //   if (savedAddress) {
  //     setmainWalletAddress(savedAddress);
  //     setIsConnected(true);
  //   }
  // }, []);

  // const handleConnect = async (): Promise<void> => {
  //   const tronWeb = (window as any).tronWeb;

  //   if (tronWeb) {
  //     if (!tronWeb.ready) {
  //       console.log("TronLink is installed, but the wallet is not connected.");
  //       alert("Please open TronLink and connect your wallet.");
  //     } else {
  //       const walletAddress: string = tronWeb.defaultAddress.base58;
  //       console.log("Wallet connected:", walletAddress);
  //       setmainWalletAddress(walletAddress); // <-- make sure this is defined in your state
  //       sessionStorage.setItem("mainWalletAddress", walletAddress);
  //     }
  //   } else {
  //     alert("TronLink is not installed. Please install it to continue.");
  //   }
  // };
  

 

  const handleCreateWallet = (walletData: {
    address: string;
    seedPhrase: string;
  }) => {
    onWalletCreated(walletData);
    setShowCreateDialog(false);
    setActiveView("connect");
  };

  const handleConnecttron = async () => {
    if (window.tronWeb && window.tronWeb.ready) {
      const walletAddress = window.tronWeb.defaultAddress.base58;
      setmainWalletAddress(walletAddress);
      console.log(walletAddress);
    }
  };

  const renderMainView = () => (
    <>
      <CardHeader className="text-center pb-2">
        <div className="mx-auto bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <Wallet className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          Tron Wallet
        </CardTitle>
        <CardDescription className="text-gray-300 mt-2">
          Connect or create a wallet to access the Tron network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => setActiveView("connect")}
            //  onClick={connectWallet}
            // onClick={() => handleConnecttron()}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg shadow-purple-500/20 border-0"
          >
            <Wallet className="mr-2 h-5 w-5" /> Connect Wallet
          </Button>
        </motion.div>
        {/* <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div> */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {/* <Button
            onClick={() => setShowCreateDialog(true)}
            variant="outline"
            className="w-full h-12 border-purple-500/30 text-purple-300 hover:bg-purple-900/20 hover:text-white hover:border-purple-400"
          >
            <Plus className="mr-2 h-5 w-5" /> Create New Wallet
          </Button> */}
        </motion.div>
      </CardContent>
    
    </>
  );

  // Animated circuit pattern background
  const CircuitBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 opacity-10">
        <CircuitBoard className="w-full h-full text-purple-500" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"
          style={{
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25],
            y: [0, Math.random() * 50 - 25],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden bg-transparent">
      {/* <CircuitBackground /> */}

      <Card className="bg-black/40 backdrop-blur-md border-[1px] border-purple-500/20 overflow-hidden relative z-10">
        {activeView === "main" && renderMainView()}

        {activeView === "connect" && (
          <>
            <CardHeader className="pb-0">
              {/* <Button
                variant="ghost"
                onClick={() => setActiveView("main")}
                className="absolute left-4 top-4 text-gray-400 hover:text-white hover:bg-gray-800/50"
              >
                Back
              </Button> */}
              {/* <CardTitle className="text-center text-xl text-white pt-6">
                Connect Your Wallet
              </CardTitle> */}
            </CardHeader>
            <CardContent className="pt-6">
              <ConnectOptions onConnect={connectWallet} />
            </CardContent>
          </>
        )}
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-md p-0 overflow-hidden">
          <DialogHeader className="pt-4 px-4">
            <DialogTitle className="text-white text-center">
              Create New Wallet
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Set up a new wallet to access the Tron network
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <CreateWalletFlow
              onComplete={handleCreateWallet}
              onCancel={() => setShowCreateDialog(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletConnector;
