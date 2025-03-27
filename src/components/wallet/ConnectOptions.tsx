import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Wallet, ArrowRight, Shield, HardDrive } from "lucide-react";

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
      <Card className="bg-black/40 backdrop-blur-md border-[1px] border-purple-500/20 overflow-hidden cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {icon}
            </div>
            <CardTitle className="text-white text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-300 mb-4">
            {description}
          </CardDescription>
          <Button
            onClick={onClick}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg shadow-purple-500/20 border-0"
          >
            Connect <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
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
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto bg-black/20 p-6 rounded-xl backdrop-blur-md">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Connect Your Wallet
      </h2>
      <div className="space-y-4">
        {connectOptions.map((option, index) => (
          <ConnectOptionCard
            key={index}
            title={option.title}
            description={option.description}
            icon={option.icon}
            onClick={option.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ConnectOptions;
