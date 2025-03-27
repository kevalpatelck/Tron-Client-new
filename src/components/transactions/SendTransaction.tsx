import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, X, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  recipientAddress: z.string().min(34, {
    message: "Tron address must be at least 34 characters.",
  }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface SendTransactionProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SendTransaction = ({
  open = true,
  onOpenChange,
}: SendTransactionProps) => {
  const [step, setStep] = useState<
    "input" | "review" | "processing" | "success" | "error"
  >("input");
  const [transactionData, setTransactionData] = useState<FormValues | null>(
    null,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientAddress: "",
      amount: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    setTransactionData(values);
    setStep("review");
  };

  const handleConfirm = () => {
    setStep("processing");
    // Simulate transaction processing
    setTimeout(() => {
      // 90% chance of success for demo purposes
      const isSuccess = Math.random() > 0.1;
      setStep(isSuccess ? "success" : "error");
    }, 2000);
  };

  const handleReset = () => {
    form.reset();
    setStep("input");
    setTransactionData(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md w-full overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-blue-400">
            {step === "input" && "Send TRX"}
            {step === "review" && "Review Transaction"}
            {step === "processing" && "Processing Transaction"}
            {step === "success" && "Transaction Successful"}
            {step === "error" && "Transaction Failed"}
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          {/* Background circuit pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" xmlns="">
              <pattern
                id="circuit"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M10,10 L90,10 L90,90 L10,90 Z"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="0.5"
                />
                <circle cx="10" cy="10" r="2" fill="#4F46E5" />
                <circle cx="90" cy="10" r="2" fill="#4F46E5" />
                <circle cx="90" cy="90" r="2" fill="#4F46E5" />
                <circle cx="10" cy="90" r="2" fill="#4F46E5" />
                <path
                  d="M10,50 L40,50 L40,10"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="0.5"
                />
                <path
                  d="M50,10 L50,40 L90,40"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="0.5"
                />
                <path
                  d="M90,60 L60,60 L60,90"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="0.5"
                />
                <path
                  d="M40,90 L40,70 L10,70"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="0.5"
                />
              </pattern>
              <rect width="100%" height="100%" fill="url(#circuit)" />
            </svg>
          </div>

          {/* Input Step */}
          {step === "input" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-4"
            >
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="recipientAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Recipient Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Tron address"
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Amount (TRX)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0.00"
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md shadow-lg hover:shadow-blue-500/20 transition-all duration-200 border-0"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}

          {/* Review Step */}
          {step === "review" && transactionData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-4 space-y-6"
            >
              <div className="bg-gray-800 rounded-lg p-4 space-y-3 border border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400">Recipient:</span>
                  <span className="text-white font-mono text-sm truncate max-w-[200px]">
                    {transactionData.recipientAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-bold">
                    {transactionData.amount} TRX
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee:</span>
                  <span className="text-white">~0.01 TRX</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-700">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-bold">
                    {(parseFloat(transactionData.amount) + 0.01).toFixed(2)} TRX
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Back
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-md shadow-lg hover:shadow-blue-500/20 transition-all duration-200 border-0"
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          )}

          {/* Processing Step */}
          {step === "processing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 flex flex-col items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
              />
              <p className="text-gray-300 text-center">
                Processing your transaction...
              </p>
              <p className="text-gray-500 text-sm text-center mt-2">
                This may take a few moments
              </p>
            </motion.div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4"
              >
                <Check className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">
                Transaction Complete!
              </h3>
              <p className="text-gray-400 text-center mb-6">
                Your TRX has been sent successfully
              </p>
              <Button
                onClick={handleReset}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-md shadow-lg hover:shadow-blue-500/20 transition-all duration-200 border-0"
              >
                Done
              </Button>
            </motion.div>
          )}

          {/* Error Step */}
          {step === "error" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-8 flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4"
              >
                <X className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">
                Transaction Failed
              </h3>
              <p className="text-gray-400 text-center mb-2">
                There was an error processing your transaction
              </p>
              <div className="bg-gray-800 rounded-lg p-3 mb-6 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300">
                  Please check your wallet balance and try again. If the problem
                  persists, contact support.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setStep("review")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-md shadow-lg hover:shadow-blue-500/20 transition-all duration-200 border-0"
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        <DialogFooter className="mt-2">
          <div className="w-full text-center text-xs text-gray-500">
            Secured by Tron Blockchain
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendTransaction;
