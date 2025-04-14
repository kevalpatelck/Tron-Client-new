import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveDownLeft, MoveUpRight, Import, History } from "lucide-react";
import moment from "moment";
import { log } from "console";
import SliderImage from "../SliderImage";
import { useDataRefetch } from "./DataRefetchContext";
import { toast } from "react-hot-toast";

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

const TransactionList = forwardRef((props, ref) => {
  const [mainWalletAddress, setMainWalletAddress] = useState<string>("");
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshingBalances, setRefreshingBalances] = useState<
    Record<string, boolean>
  >({});
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<number>(0);
  const [isBalance, setIsBalance] = useState<number>(0);
  const [addressWallet, setAddressWallet] = useState<string>("");
  const [isValidBalance, setIsValidBalance] = useState<string | null>(null);

  // 🔐 Private Key Popup State
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);
  const [historyPopup, setHistoryPopup] = useState<HistoryPopupData | null>(
    null
  );
  const { refetchFlag } = useDataRefetch();
  const [showPopup, setShowPopup] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedAccount.privateKey || "");
      // setShowPopup(true);
      toast.custom(
        <div className="flex items-start gap-3 bg-white text-gray-800 px-6 py-4 rounded-xl shadow-2xl border border-blue-200 w-[400px]">
          <div className="mt-1">
            <Import size={28} className="text-blue-500" />
          </div>
          <div className="text-[14px] leading-relaxed font-medium">
            <div className="text-blue-600 font-semibold mb-1">
              Import Subaccount Wallet
            </div>
            <div>
              Your subAccount's privatekey is copied. Click on this button to
              learn how to import a subaccount using a private key.
            </div>
          </div>
        </div>,
        {
          duration: 1500,
        }
      );
      // setShowPopup(true); // Show popup after copy
    } catch (err) {
      console.error("Clipboard error:", err);
      alert("❌ Failed to copy.");
    }
  };

  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchTransactionHistory = async (walletAddress: string) => {
    try {
      setHistoryLoading(true);

      const walletAddress1=localStorage.getItem("mainWalletAddress")
      console.log("wallwgqcxgavc=====>",walletAddress1);
      
      const response = await fetch(
        `https://tronrewards-backend.onrender.com/api/tron/transactions?address=${walletAddress1}`
      );
      if (!response.ok) throw new Error("Failed to fetch history");

      const result = await response.json();
      const transactions = result.data?.message?.transactions || [];

      setHistoryPopup({ address: walletAddress, data: transactions });
    } catch (err) {
      console.error("History fetch error:", err);
      setHistoryPopup({ address: walletAddress, data: [] });
    } finally {
      setHistoryLoading(false);
    }
  };

  const cancelForm = () => {
    setIsOpen(false);
    setInputValue(0);
    setIsValidBalance(null);
  };

  const transferAmount = async () => {
    console.log("Address Wallet:", addressWallet);
    console.log("Transfer Amount:", inputValue);

    if (Number(inputValue) > Number(isBalance)) {
      alert("Insufficient Balance");
      setIsValidBalance("Insufficient Balance"); // make sure setIsValidBalance exists
      return;
    }

    try {
      const response = await fetch(
        "https://tronrewards-backend.onrender.com/api/tron/send-usdt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amountInUSDT: inputValue,
            address: addressWallet,
          }),
        }
      );

      const data = await response.json();

      setIsOpen(false);

      if (response.ok) {
        alert("Transfer successful!");
        // Optionally refresh balances here
      } else {
        alert(`Error: ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to connect to the server.");
    }
  };

  // 🧠 Expose refresh function to parent
  useImperativeHandle(ref, () => ({
    refreshSubAccounts: async () => {
      if (mainWalletAddress) {
        const updatedSubs = await getSubAccounts(mainWalletAddress);
        setSubAccounts(updatedSubs);
      }
    },
  }));

  const getSubAccounts = async (wallet: string): Promise<SubAccount[]> => {
    const response = await fetch(
      `https://tronrewards-backend.onrender.com/api/tron/get-sub-id?address=${wallet}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.data?.SubAccounts ?? [];
  };

  const refreshBalance = async (uid: string) => {
    setRefreshingBalances((prev) => ({ ...prev, [uid]: true }));
    setTimeout(() => {
      setRefreshingBalances((prev) => ({ ...prev, [uid]: false }));
    }, 1000);
  };

  const btnAdd = (USDTBalance: number, address: string) => {
    setIsBalance(USDTBalance);
    setIsOpen(true);
    setAddressWallet(address);
    console.log("Balance:", USDTBalance);
  };

  // 👁️ Show Popup and fetch private key
  const togglePopup = async (account: SubAccount, mainWallet: string) => {
    try {
      const response = await fetch(
        `https://tronrewards-backend.onrender.com/api/tron/get-sub-id?address=${mainWallet}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const matched = data.data?.SubAccounts?.find(
        (sub: any) => sub.address === account.address
      );

      setSelectedAccount({
        ...account,
        privateKey: matched?.privateKey || "Unavailable",
      });

      setShowPrivateKey(false); // hide initially
    } catch (err) {
      console.error("Error fetching private key:", err);
      setSelectedAccount({
        ...account,
        privateKey: "Error retrieving key",
      });
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      try {
        const wallet = localStorage.getItem("mainWalletAddress");
        // console.log(localStorage.getItem("mainWalletAddress"));
        
        setMainWalletAddress(wallet);
        const subs = await getSubAccounts(wallet);
        setSubAccounts(subs);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (window.tronWeb && window.tronWeb.ready) {
      fetchData();
    } else {
      const interval = setInterval(() => {
        if (window.tronWeb && window.tronWeb.ready) {
          clearInterval(interval);
          fetchData();
        }
      }, 500);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [refetchFlag]);

  if (!loading && subAccounts.length === 0) {
    return (
      <div className="text-center text-red-500 py-10">
        No sub Accounts Found For this Account
      </div>
    );
  }

  if (error)
    return (
      <div className="text-center text-red-500 py-10">
        No sub accounts found
      </div>
    );

  return (
    <>
      <div className="overflow-x-auto max-h-[550px] bg-black/20 backdrop-blur-lg rounded-xl p-4 text-white">
        <table className="min-w-full bg-black/10 backdrop-blur-md rounded-lg text-white">
          <thead className="text-sm text-gray-400">
            <tr className="border-b border-gray-700">
              <th className="py-3 px-4 text-left">Id</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Wallet Address</th>
              <th className="py-3 px-4 text-left">Trx-Balance</th>
              <th className="py-3 px-4 text-left">Usdt-Balance</th>
              <th className="py-3 px-4 text-left">Import</th>
              <th className="py-3 px-4 text-left">Transfer To Main</th>
              <th className="py-3 px-4 text-left">View History</th>
            </tr>
          </thead>
          <tbody>
            {subAccounts.map((account) => (
              <tr
                key={account.UID}
                ref={(el) => (rowRefs.current[account.UID] = el)}
                className={`border-b border-gray-700 hover:bg-black/40 transition-colors ${
                  highlightId === account.UID
                    ? "bg-yellow-400/20"
                    : "bg-black/30"
                }`}
              >
                <td className="py-4 px-4 text-sm text-white">{account.UID}</td>
                <td className="py-4 px-4 text-sm text-white">
                  {account.userName}
                </td>
                <td className="py-4 px-4 text-sm text-white">
                  {account.address}
                </td>
                <td className="py-4 px-4 text-sm text-white">
                  {account.TRXbalance}
                </td>
                <td className="pt-7 pb-4 px-4 flex items-center justify-between">
                  <span className="font-semibold text-white">
                    {account.USDTBalance}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => togglePopup(account, mainWalletAddress)}
                    className="relative group text-white"
                  >
                    👁️
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-32 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity p-1 text-center">
                      View Details
                    </div>
                  </button>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() =>
                        btnAdd(account?.USDTBalance, account?.address)
                      }
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-90"
                    >
                      Send
                    </button>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => fetchTransactionHistory(account.address)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 px-5 text-lg rounded-lg shadow hover:scale-105 transition-transform"
                  >
                    <History size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔒 Private Key Popup */}
      {/* 🔒 Private Key Popup */}
      {selectedAccount && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              🔐 Private Key for {selectedAccount.userName}
            </h2>

            <div className="bg-gray-100 p-3 rounded flex justify-between items-center mb-4">
              <span className="font-mono text-sm break-all">
                {showPrivateKey
                  ? selectedAccount.privateKey
                  : "••••••••••••••••••••••••••••••"}
              </span>
            </div>

            <div className="flex gap-3 justify-center">
              {/* <button
          onClick={() => setShowPrivateKey(!showPrivateKey)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showPrivateKey ? "Hide" : "Show"}
        </button> */}

              <button
                onClick={handleCopy}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Copy
              </button>

              {showPopup && <SliderImage onClose={() => setShowPopup(false)} />}
              <button
                onClick={() => setSelectedAccount(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
                      `TX #${index + 1} | ${amount} ${currency} | ${timestamp}`
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

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 transform transition-all scale-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Enter Amount to Transfer
            </h2>

            <input
              type="number"
              placeholder="Enter Amount"
              // value={inputValue}
              onChange={(e) => {
                const value = Number(e.target.value);
                setInputValue(value);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            />
            {isValidBalance && (
              <p className="text-red-500 text-sm mb-2">{isValidBalance}</p>
            )}

            <div className="flex space-x-4">
              <button
                onClick={transferAmount}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                Transfer
              </button>
              <button
                onClick={cancelForm}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default TransactionList;
