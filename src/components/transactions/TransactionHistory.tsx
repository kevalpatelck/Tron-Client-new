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
