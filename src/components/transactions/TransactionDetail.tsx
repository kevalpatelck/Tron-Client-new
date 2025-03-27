import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { ExternalLink, Copy, CheckCircle, XCircle, Clock } from "lucide-react";

interface TransactionDetailProps {
  isOpen?: boolean;
  onClose?: () => void;
  transaction?: {
    id: string;
    hash: string;
    type: string;
    amount: number;
    status: "success" | "failed" | "pending";
    timestamp: string;
    from: string;
    to: string;
    fee: number;
  };
}

const TransactionDetail = ({
  isOpen = true,
  onClose = () => {},
  transaction = {
    id: "tx123456789",
    hash: "0x7d5a4369273c723454c4a92dd9966a5d4f7fafcb9a32bac3ec5e2c68f8af79d2",
    type: "Transfer",
    amount: 150.75,
    status: "success" as const,
    timestamp: "2023-06-15T14:32:17Z",
    from: "TJRabPrwbZy45sbavfcjinPJC18kjpRTv8",
    to: "TY65QiDt4hLTMpf3WRzcX357BnmdxT2sw9",
    fee: 0.01,
  },
}: TransactionDetailProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real implementation, you would show a toast notification here
  };

  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
  };

  const getStatusBadge = () => {
    switch (transaction.status) {
      case "success":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/20 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Success
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500/20 flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Failed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            Transaction Details
            {getStatusBadge()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-gray-400">Transaction Hash</span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">
                  {truncateHash(transaction.hash)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-gray-800"
                  onClick={() => copyToClipboard(transaction.hash)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-gray-800"
                  onClick={() =>
                    window.open(
                      `https://tronscan.org/#/transaction/${transaction.hash}`,
                      "_blank",
                    )
                  }
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Type</span>
              <span>{transaction.type}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Amount</span>
              <span className="font-semibold text-lg">
                {transaction.amount} TRX
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Fee</span>
              <span>{transaction.fee} TRX</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Date & Time</span>
              <span>{formatDate(transaction.timestamp)}</span>
            </div>
          </div>

          <Separator className="bg-gray-800" />

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-gray-400">From</span>
              <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-md">
                <span className="font-mono text-sm truncate">
                  {transaction.from}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-gray-700"
                  onClick={() => copyToClipboard(transaction.from)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-gray-400">To</span>
              <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-md">
                <span className="font-mono text-sm truncate">
                  {transaction.to}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full hover:bg-gray-700"
                  onClick={() => copyToClipboard(transaction.to)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-700 hover:bg-gray-800 hover:text-white"
          >
            Close
          </Button>
          <Button
            onClick={() =>
              window.open(
                `https://tronscan.org/#/transaction/${transaction.hash}`,
                "_blank",
              )
            }
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-700/20"
          >
            View on TronScan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetail;
