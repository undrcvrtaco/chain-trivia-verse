
import React from 'react';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface ConnectButtonProps {
  onConnect: () => void;
  isConnecting: boolean;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ onConnect, isConnecting }) => {
  return (
    <Button 
      onClick={onConnect}
      disabled={isConnecting}
      size="lg"
      className="bg-gradient-to-r from-trivia-primary via-trivia-secondary to-trivia-accent hover:opacity-90 transition-all duration-300"
    >
      {isConnecting ? (
        <div className="flex items-center">
          <div className="h-4 w-4 mr-2 rounded-full border-2 border-trivia-light border-t-transparent animate-spin"></div>
          Connecting...
        </div>
      ) : (
        <>
          <User className="mr-2 h-5 w-5" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};

export default ConnectButton;
