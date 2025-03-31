import React, { useEffect, useState } from "react";
import { Copy, QrCode, History } from "lucide-react";
import QRCode from "react-qr-code";
import moment from "moment";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { set } from "date-fns";

declare global {
  interface Window {
    tronWeb: any; // or define a specific TronWeb type if available
  }
}
interface SubAccount {
  UID: string;
  userName: string;
  address: string;
  TRXbalance: string;
  USDTBalance: number;
}

interface Transaction {
  TXNtype: "sent" | "received" | string;
  amount: number | string;
  timestamp: number; // Unix timestamp (in seconds or milliseconds)
}

interface HistoryPopupData {
  address: string;
  data: Transaction[];
}
function formatDateTime(timestamp: number): { date: string; time: string } {
  const isMillis = timestamp > 1_000_000_000_000; // Detect ms vs s
  const ts = isMillis ? timestamp : timestamp * 1000;
  const m = moment(ts);

  if (!m.isValid()) {
    return { date: "Invalid Date", time: "Invalid Time" };
  }

  return {
    date: m.format("YYYY-MM-DD"),
    time: m.format("hh:mm A"),
  };
}

declare global {
  interface Window {
    tronWeb: any;
  }
}


const WalletCard = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [trxBalance, setTrxBalance] = useState<string>("0.00");
  const [usdtBalance, setUsdtBalance] = useState<string>("0.00");
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [historyPopup, setHistoryPopup] = useState<any>(null);
  const [historyLoading, setHistoryLoading] = useState<boolean>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let retries = 0;
    const maxRetries = 10;

    const waitForTronWeb = async () => {
      if (window.tronWeb && window.tronWeb.ready) {
        clearInterval(intervalId);
        fetchWalletData(); // call actual data fetch function
      } else {
        retries++;
        if (retries >= maxRetries) {
          clearInterval(intervalId);
          setLoading(false); // stop loading even if failed
          console.warn("TronLink not detected or not ready after retries");
        }
      }
    };


    
    intervalId = setInterval(waitForTronWeb, 500); // check every 500ms

    const fetchWalletData = async () => {
      try {
        const walletAddress = window.tronWeb.defaultAddress.base58;
        setWalletAddress(walletAddress);
        localStorage.setItem("mainWalletAddress", walletAddress);

        const balanceInSun = await window.tronWeb.trx.getBalance(walletAddress);
        const trx = window.tronWeb.fromSun(balanceInSun);
        setTrxBalance(trx);

        const contract = await window.tronWeb
          .contract()
          .at("TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf");
        const balance = await contract.balanceOf(walletAddress).call();
        const usdt = window.tronWeb.toDecimal(balance) / 1e6;
        setUsdtBalance(usdt.toFixed(2));
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    return () => clearInterval(intervalId); // cleanup on unmount
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

  const fetchTransactionHistory = async (walletAddress: string) => {
    try {
      setHistoryLoading(true);
      const response = await fetch(
        `https://tronrewards-backend.onrender.com/api/tron/transactions?address=${walletAddress}`
      );
      if (!response.ok) throw new Error("Failed to fetch history");
      const result = await response.json();
      console.log("Transaction history:", result);

      setHistoryPopup({
        address: walletAddress,
        data: result.data?.message?.transactions || [],
      });
    } catch (err) {
      console.error("History fetch error:", err);
      setHistoryPopup({ address: walletAddress, data: [] });
    } finally {
      setHistoryLoading(false);
    }
  };

  const displayAddress =
    walletAddress.length > 16
      ? `${walletAddress.substring(0, 8)}...${walletAddress.substring(
          walletAddress.length - 8
        )}`
      : walletAddress;

  if (loading) {
    return (
      <Card className="bg-black/80 backdrop-blur-md border-purple-500/20 text-white overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex justify-between items-center">
            <span>Main Wallet</span>
            <Button className=" bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg">
              <History size={16} />
            </Button>
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
                {/* {usdtBalance} */}
                <p className="text-[18px]">Getting usdt...</p>
              </span>
              <span className="ml-2 mb-1 text-gray-400">USDT</span>
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
  }

  return (
    <>
      <Card className="bg-black/80 backdrop-blur-md border-purple-500/20 text-white overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex justify-between items-center">
            <span>Main Wallet</span>
            <Button
              className=" bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg"
              onClick={() => fetchTransactionHistory(walletAddress)}
            >
              <History size={16} />
            </Button>
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

      <div>
        {historyPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                📜 Transaction History for {historyPopup.address}
              </h2>
              {historyLoading ? (
                <p className="text-center">Loading...</p>
              ) : historyPopup.data.length === 0 ? (
                <p className="text-center text-gray-500">
                  No transactions found.
                </p>
              ) : (
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Amount (TRX)</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyPopup.data.map((tx: any, index: number) => {
                      const isReceived = tx.TXNtype === "received";
                      const arrow = isReceived ? "⬇️" : "⬆️";
                      const arrowColor = isReceived
                        ? "text-green-500"
                        : "text-red-500";

                      const timestamp =
                        tx.block_timestamp || tx.raw_data?.timestamp || 0;
                      const { date, time } = formatDateTime(timestamp);

                      // Extract amount and currency
                      let amount = "0.00";
                      let currency = "TRX";

                      try {
                        const contract = tx.raw_data?.contract?.[0];
                        const contractType = contract?.type;

                        if (contractType === "TransferContract") {
                          const amountRaw = contract.parameter?.value?.amount;
                          amount = (Number(amountRaw) / 1_000_000).toFixed(2);
                          currency = "TRX";
                        } else if (contractType === "TriggerSmartContract") {
                          const dataHex = contract.parameter?.value?.data;
                          if (dataHex && dataHex.length >= 136) {
                            const amountHex = dataHex.slice(72, 136);
                            const parsedAmount = parseInt(amountHex, 16);
                            amount = (parsedAmount / 1_000_000).toFixed(2);
                            currency = "USDT";
                          }
                        }
                      } catch (err) {
                        console.warn("Error extracting amount:", err);
                      }

                      console.log(
                        `TX #${
                          index + 1
                        } | ${amount} ${currency} | ${timestamp}`
                      );

                      return (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="px-4 py-2 flex items-center gap-1">
                            <span className={arrowColor}>{arrow}</span>
                            {tx.TXNtype || "Transfer"}
                          </td>
                          <td className="px-4 py-2">
                            {amount}{" "}
                            <span className="text-xs text-gray-500">
                              {currency}
                            </span>
                          </td>
                          <td className="px-4 py-2">{date}</td>
                          <td className="px-4 py-2">{time}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setHistoryPopup(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WalletCard;
