import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Wallet, ArrowRight, Shield, HardDrive } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ConnectOptionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const ConnectOptionCard = ({
  title = "Connect Option",
  description = "Connect your wallet securely",
  icon = <Wallet className="h-6 w-6" />,
  onClick = () => console.log("Connect option clicked"),
}: ConnectOptionProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <div className="rounded-xl text-card-foreground shadow bg-black/40 backdrop-blur-md border-[1px] border-purple-500/20 overflow-hidden relative z-10">
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
            onClick={onClick}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg shadow-purple-500/20 border-0"
          >
            <Wallet className="mr-2 h-5 w-5" /> Connect Wallet
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        ></motion.div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6 pt-2">
        <p className="text-gray-400 text-xs text-center">
          By connecting, you agree to the{" "}
          <a
            href="#"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Privacy Policy
          </a>
        </p>
      </CardFooter>
      </div>
    </motion.div>
  );
};

interface ConnectOptionsProps {
  onConnect?: (method: string) => void;
}

const ConnectOptions = ({
  onConnect = () => console.log("Connect method selected"),
}: ConnectOptionsProps) => {
  const connectOptions = [
    {
      title: "MetaMask",
      description: "Connect using your MetaMask wallet",
      icon: <Wallet className="h-6 w-6" />,
      onClick: () => onConnect("metamask"),
    },
  ];

  return (
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
      {connectOptions.map((option, index) => (
        <CardContent className="space-y-4 pt-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              key={index}
              title={option.title}
              onClick={option.onClick}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg shadow-purple-500/20 border-0"
            >
              <Wallet className="mr-2 h-5 w-5" /> Connect Wallet
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          ></motion.div>
        </CardContent>
      ))}
    </>
  );
};

export default ConnectOptions;
