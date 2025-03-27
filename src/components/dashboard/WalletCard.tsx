import React, { useEffect, useState } from "react";
import { Copy, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    tronWeb: any; // or define a specific TronWeb type if available
  }
}

const WalletCard = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [trxBalance, setTrxBalance] = useState<string>("0.00");
  const [usdtBalance, setUsdtBalance] = useState<string>("0.00");
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetchWalletData = async () => {

      try {
        if (window.tronWeb && window.tronWeb.ready) {
          const walletAddress = window.tronWeb.defaultAddress.base58;
          setWalletAddress(walletAddress);
          sessionStorage.setItem("mainWalletAddress", walletAddress);

          // TRX Balance
          const balanceInSun = await window.tronWeb.trx.getBalance(
            walletAddress
          );
          const trx = window.tronWeb.fromSun(balanceInSun);
          setTrxBalance(trx);

          // USDT Balance
          const contract = await window.tronWeb
            .contract()
            .at("TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf");
          const balance = await contract.balanceOf(walletAddress).call();
          const usdt = window.tronWeb.toDecimal(balance) / 1e6;
          setUsdtBalance(usdt.toFixed(2));
        } else {
          console.warn("TronLink not connected or not ready");
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const handleCopyAddress = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleQRCode = () => {
    setShowQR(!showQR);
  };

  const displayAddress =
    walletAddress.length > 16
      ? `${walletAddress.substring(0, 8)}...${walletAddress.substring(
          walletAddress.length - 8
        )}`
      : walletAddress;

  if (loading) {
    return (
      <Card className="w-full max-w-[450px] text-white p-4 bg-black/80 text-center">
        <p>Loading wallet data...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-black/80 backdrop-blur-md border-purple-500/20 text-white overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex justify-between items-center">
          <span>Main Wallet</span>
          {/* <span className="text-purple-400 text-sm">TRX / USDT</span> */}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* TRX */}
          <div className="flex items-end">
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {trxBalance}
            </span>
            <span className="ml-2 text-gray-400">TRX</span>
          </div>

          {/* USDT */}
          <div className="flex items-end">
            <span className="text-2xl font-semibold text-green-400">
              {usdtBalance}
            </span>
            <span className="ml-2 text-gray-400">USDT</span>
          </div>

          {/* Address */}
          <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-lg border border-purple-500/20">
            <span className="text-gray-300 text-sm truncate mr-2">
              {displayAddress}
            </span>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300",
                  copied && "bg-green-800 text-green-200"
                )}
                onClick={handleCopyAddress}
              >
                <Copy size={16} />
              </Button>
              {/* <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300",
                  showQR && "bg-purple-800 text-purple-200"
                )}
                onClick={toggleQRCode}
              >
                <QrCode size={16} />
              </Button> */}
            </div>
          </div>

          {showQR && walletAddress && (
            <div className="mt-4 flex justify-center p-4 bg-white rounded-lg">
              <QRCode value={walletAddress} size={128} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
