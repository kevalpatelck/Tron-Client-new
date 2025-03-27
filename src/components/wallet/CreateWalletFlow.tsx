import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  Lock,
  Key,
} from "lucide-react";

interface CreateWalletFlowProps {
  onComplete?: (walletData: { address: string; seedPhrase: string }) => void;
  onCancel?: () => void;
  isOpen?: boolean;
}

const CreateWalletFlow: React.FC<CreateWalletFlowProps> = ({
  onComplete = () => {},
  onCancel = () => {},
  isOpen = true,
}) => {
  const [step, setStep] = useState<number>(1);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [seedPhrase, setSeedPhrase] = useState<string>(
    "abandon ability able about above absent absorb abstract absurd abuse access accident",
  );
  const [seedPhraseConfirmed, setSeedPhraseConfirmed] =
    useState<boolean>(false);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  // Mock function to generate a wallet
  const generateWallet = () => {
    // In a real implementation, this would generate a real wallet
    return {
      address: "0xTR0N1234567890abcdef1234567890abcdef",
      seedPhrase,
    };
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(seedPhrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNextStep = () => {
    if (step === 4) {
      const wallet = generateWallet();
      onComplete(wallet);
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step === 1) {
      onCancel();
    } else {
      setStep(step - 1);
    }
  };

  const validatePassword = () => {
    return password.length >= 8 && password === confirmPassword;
  };

  const validateSeedPhrase = () => {
    // In a real implementation, this would validate that the user has correctly
    // entered the seed phrase in the correct order
    setSeedPhraseConfirmed(true);
    return true;
  };

  const handleWordSelect = (word: string) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step === i ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400"}`}
            >
              {i}
            </div>
            {i < 4 && (
              <div
                className={`h-1 w-8 ${step > i ? "bg-purple-600" : "bg-gray-800"}`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderPasswordStep = () => {
    return (
      <>
        <CardHeader>
          <CardTitle className="text-center text-xl text-white">
            Set Wallet Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-gray-300">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="pt-2">
            <Alert className="bg-gray-800 border-gray-700">
              <Lock className="h-4 w-4" />
              <AlertDescription className="text-gray-300">
                Your password must be at least 8 characters long and will be
                used to encrypt your wallet.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </>
    );
  };

  const renderSeedPhraseStep = () => {
    return (
      <>
        <CardHeader>
          <CardTitle className="text-center text-xl text-white">
            Your Seed Phrase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-gray-800 border-yellow-600">
            <AlertDescription className="text-yellow-500">
              <strong>IMPORTANT:</strong> Write down your seed phrase and store
              it in a secure location. Anyone with access to this phrase can
              access your wallet.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 relative">
            <div className="grid grid-cols-3 gap-2">
              {seedPhrase.split(" ").map((word, index) => (
                <div key={index} className="flex">
                  <span className="text-gray-500 mr-2">{index + 1}.</span>
                  <span className="text-purple-400">{word}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              aria-label="Copy seed phrase"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>

          <div className="pt-2">
            <Alert className="bg-gray-800 border-gray-700">
              <Key className="h-4 w-4" />
              <AlertDescription className="text-gray-300">
                Never share your seed phrase with anyone. Tron Wallet will never
                ask for it.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </>
    );
  };

  const renderConfirmSeedPhraseStep = () => {
    // Shuffle the seed phrase for verification
    const shuffledWords = [...seedPhrase.split(" ")].sort(
      () => Math.random() - 0.5,
    );

    return (
      <>
        <CardHeader>
          <CardTitle className="text-center text-xl text-white">
            Confirm Your Seed Phrase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300 text-center">
            Select the words in the correct order to confirm you've saved your
            seed phrase
          </p>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 min-h-[100px]">
            <div className="flex flex-wrap gap-2">
              {selectedWords.map((word, index) => (
                <div
                  key={`selected-${index}`}
                  className="bg-purple-900 text-white px-3 py-1 rounded-md flex items-center"
                  onClick={() => handleWordSelect(word)}
                >
                  <span>{word}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-gray-700" />

          <div className="flex flex-wrap gap-2">
            {shuffledWords.map((word, index) => (
              <button
                key={`option-${index}`}
                className={`px-3 py-1 rounded-md ${selectedWords.includes(word) ? "bg-gray-700 text-gray-400" : "bg-gray-800 text-white hover:bg-gray-700"}`}
                onClick={() => handleWordSelect(word)}
                disabled={selectedWords.includes(word)}
              >
                {word}
              </button>
            ))}
          </div>
        </CardContent>
      </>
    );
  };

  const renderCompletionStep = () => {
    return (
      <>
        <CardHeader>
          <CardTitle className="text-center text-xl text-white">
            Wallet Created!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 bg-purple-600 rounded-full mx-auto flex items-center justify-center"
          >
            <Check size={48} className="text-white" />
          </motion.div>

          <p className="text-gray-300">
            Your wallet has been created successfully. You can now access the
            Tron network.
          </p>

          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">Wallet Address:</p>
            <p className="text-purple-400 font-mono text-sm break-all">
              {generateWallet().address}
            </p>
          </div>
        </CardContent>
      </>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return renderPasswordStep();
      case 2:
        return renderSeedPhraseStep();
      case 3:
        return renderConfirmSeedPhraseStep();
      case 4:
        return renderCompletionStep();
      default:
        return renderPasswordStep();
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !validatePassword();
    if (step === 3) return selectedWords.join(" ") !== seedPhrase;
    return false;
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md mx-auto">
      <Card className="bg-gray-900 border-gray-700 shadow-lg shadow-purple-900/20">
        {renderStepIndicator()}
        {renderCurrentStep()}
        <CardFooter className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <ArrowLeft size={16} className="mr-2" />
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={isNextDisabled()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-purple-900/30"
          >
            {step === 4 ? "Finish" : "Continue"}
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateWalletFlow;
