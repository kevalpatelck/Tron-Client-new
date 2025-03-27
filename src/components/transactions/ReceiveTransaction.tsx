import React, { useState } from "react";
import { Copy, QrCode } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ReceiveTransactionProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  walletAddress?: string;
}

const ReceiveTransaction = ({
  open = true,
  onOpenChange,
  walletAddress = "TRX1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
}: ReceiveTransactionProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">
            Receive TRX
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Scan the QR code or copy the address below to receive TRX
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-6 py-4">
          <Card className="bg-gray-800 border-gray-700 w-64 h-64 flex items-center justify-center overflow-hidden">
            <CardContent className="p-0 w-full h-full">
              <div className="bg-white p-2 w-full h-full flex items-center justify-center">
                <QrCode
                  size={220}
                  className="text-gray-900"
                  // value={walletAddress}
                />
              </div>
            </CardContent>
          </Card>

          <div className="w-full space-y-2">
            <p className="text-sm text-gray-400 text-center">
              Your Wallet Address
            </p>
            <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg p-3">
              <p className="text-sm text-gray-300 truncate max-w-[280px]">
                {walletAddress}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="hover:bg-gray-700 text-blue-400"
              >
                {copied ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-green-400"
                  >
                    ✓
                  </motion.div>
                ) : (
                  <Copy size={18} />
                )}
              </Button>
            </div>
          </div>

          <div className="w-full pt-4">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all duration-200">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiveTransaction;
