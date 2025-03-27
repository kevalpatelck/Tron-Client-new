import React, { useState,useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import TransactionFilters from "./TransactionFilters";
import TransactionList from "./TransactionList";
import { useDataRefetch } from "./DataRefetchContext";

interface Transaction {
  id: string;
  date: string;
  type: "send" | "receive" | "swap" | "stake";
  amount: string;
  status: "completed" | "pending" | "failed";
  address: string;
  hash: string;
}



interface TransactionHistoryProps {
  transactions?: Transaction[];
  refreshTrigger?: number;
}
// useEffect(() => {
//   refreshTransactions(); // ✅ Call refresh function when trigger changes
// }, [refreshTrigger]);

const TransactionHistory = ({
  transactions = [
    {
      id: "tx1",
      date: "2023-06-15T14:30:00",
      type: "receive" as const,
      amount: "+25.5 TRX",
      status: "completed" as const,
      address: "TY65QiDt4hLTMpf3WRzcX357BnmdxT2sw9",
      hash: "0x7d92f8d5c9e8f9d6e9c8d7f6e5d4c3b2a1",
    },
    {
      id: "tx2",
      date: "2023-06-14T09:15:00",
      type: "send" as const,
      amount: "-10.0 TRX",
      status: "completed" as const,
      address: "TJRabPrwbZy45sbavfcjinPJC18kjpRTv8",
      hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7",
    },
    {
      id: "tx3",
      date: "2023-06-13T18:45:00",
      type: "swap" as const,
      amount: "5.0 TRX → 10.5 BTT",
      status: "pending" as const,
      address: "TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9",
      hash: "0x9p8o7n6m5l4k3j2i1h0g9f8e7d6c5b4a3",
    },
    {
      id: "tx4",
      date: "2023-06-12T11:20:00",
      type: "stake" as const,
      amount: "-100.0 TRX",
      status: "failed" as const,
      address: "TVj7RNVHy6thbM7BWdSe9G6gXwKhjhdNZS",
      hash: "0x3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9",
    },
  ],
  refreshTrigger,
}: TransactionHistoryProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>(transactions);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { triggerRefetch } = useDataRefetch();

  // Filter transactions based on tab
  const filterTransactionsByTab = (tab: string) => {
    if (tab === "all") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter((tx) => tx.type === tab));
    }
    setActiveTab(tab);
  };
  // Simulate refreshing transactions
  const refreshTransactions = () => {
  
    setIsRefreshing(true);
    setTimeout(() => {
      console.log("Transactions refreshed!");
      setIsRefreshing(false);
    }, 1000);
  };
  // Handle filter changes from TransactionFilters component
  const handleFilterChange = (filters: {
    search: string;
    dateRange: { from: Date; to: Date } | undefined;
    type: string;
    status: string;
  }) => {
    let filtered = [...transactions];


    useEffect(() => {
      refreshTransactions();
    }, [refreshTrigger]);

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (tx) =>
          tx.address.toLowerCase().includes(searchLower) ||
          tx.hash.toLowerCase().includes(searchLower) ||
          tx.amount.toLowerCase().includes(searchLower),
      );
    }

    // Filter by date range
    if (filters.dateRange?.from && filters.dateRange?.to) {
      filtered = filtered.filter((tx) => {
        const txDate = new Date(tx.date);
        return (
          txDate >= filters.dateRange!.from && txDate <= filters.dateRange!.to
        );
      });
    }

    // Filter by type
    if (filters.type !== "all") {
      filtered = filtered.filter((tx) => tx.type === filters.type);
    }

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((tx) => tx.status === filters.status);
    }

    setFilteredTransactions(filtered);
  };

  // Simulate refreshing transactions
  // const refreshTransactions = () => {
  //   setIsRefreshing(true);
  //   setTimeout(() => {
  //     setIsRefreshing(false);
  //   }, 1000);
  // };

  // Handle viewing transaction details
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsOpen(true);
  };

  return (
    <Card className="w-full bg-black/30 backdrop-blur-xl border-gray-800 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-white">
       Sub Accounts
          </CardTitle>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={triggerRefetch}
            className="text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 1, ease: "linear" }}
            >
              <RefreshCw size={18} />
            </motion.div>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* <TransactionFilters onFilterChange={handleFilterChange} /> */}

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={filterTransactionsByTab}
          className="w-full"
        >
          

          <TabsContent value={activeTab} className="mt-5">
            <TransactionList/>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Transaction Details Dialog */}
    
    </Card>
  );
};

export default TransactionHistory;
