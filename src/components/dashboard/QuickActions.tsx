import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface QuickActionProps {
  onSend?: () => void;
  onReceive?: () => void;
  onSwap?: () => void;
  onStake?: () => void;
  onSubAccountAdded?: () => void; // 👈 Add refresh callback prop
}

const QuickActions = ({
  onSend = () => {},
  onReceive = () => {},
  onSwap = () => {},
  onStake = () => {},
  onSubAccountAdded = () => {}, // 👈 Default empty function
}: QuickActionProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ UID: "", userName: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormData({ UID: "", userName: "" });
  };

  const handleSubAccountAdded = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://tronrewards-backend.onrender.com/api/tron/create-sub",
        formData
      );

      if (response?.data?.success) {
        toast.success("Account Created Successfully", { autoClose: 1500 });
        alert("Sub account added");
        onSubAccountAdded(); // ✅ This will trigger a refresh in Dashboard
      } else {
        // Extract userName if the account already exists
        const existingUserName = response?.data?.data?.subAccount?.userName;
        toast(
          <div className="flex items-center gap-3 bg-purple-700 text-white px-4 py-3 rounded-lg shadow-lg border-2 border-blue-400 w-[300px]">
            <div className="mt-1"></div>
            <div className="text-sm font-medium">
              <div>
                A sub-account Named with This Uid With Named{" "}
                <span className="font-semibold mb-1">{existingUserName}</span>{" "}
                already exists.
              </div>
            </div>
          </div>,
          {
            autoClose: 2000,
            closeOnClick: true,
            draggable: true,
            position: "top-center", // Center position
            hideProgressBar: true,
          }
        );
      }
    } catch (error: any) {
      console.error("Error creating subaccount:", error);

      // If the error response contains data, extract the message
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.message || "Error creating subaccount";
        toast.error(errorMessage, { autoClose: 2000 });
      } else {
        toast.error("Error creating subaccount", { autoClose: 2000 });
      }
    }
    closeForm();
  };

  const actions = [
    {
      title: "Add Sub Account",
      icon: <Plus size={20} />,
      onClick: () => setIsFormOpen(true),
      gradient: "from-blue-500 to-purple-600",
    },
  ];

  return (
    <>
      <Card className="h-full bg-black/40 backdrop-blur-md border-gray-800 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {actions.map((action, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Button
                  onClick={action.onClick}
                  className={`w-full sm:w-full md:w-[670px] lg:w-[400px] xl:w-[500px]
            h-[100px] sm:h-[110px] md:h-[120px] lg:h-[130px]
            flex flex-col items-center justify-center space-y-2
            bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400
            bg-[length:200%_200%] animate-gradient-flow
            transition-all duration-1200 rounded-xl text-white mx-auto`}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm">
                    {action.icon}
                  </div>
                  <div className="text-sm font-medium text-center">
                    {action.title}
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popup form for Sub Account Creation */}
      {isFormOpen && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 w-96 bg-gray-900 rounded-lg shadow-xl p-6 z-50">
          <h2 className="text-xl font-bold text-white mb-4">
            Create Sub Account
          </h2>
          <form onSubmit={handleSubAccountAdded}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="UID" className="text-sm text-gray-400">
                  UID
                </label>
                <input
                  name="UID"
                  onChange={handleChange}
                  placeholder="Enter UID"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Name</label>
                <input
                  name="userName"
                  onChange={handleChange}
                  required
                  placeholder="Enter Name"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-1/2 md:w-1/3 py-3 sm:py-2 md:py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded font-medium text-white text-lg sm:text-base md:text-sm"
              >
                Add Sub Account
              </button>

              <button
                type="button"
                onClick={closeForm}
                className="w-full py-2 text-sm font-medium text-blue-400 hover:text-blue-200 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default QuickActions;
