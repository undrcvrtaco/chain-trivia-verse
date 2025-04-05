
import React from 'react';
import { Button } from "@/components/ui/button";

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
      className="bg-primary hover:bg-primary/90 text-white rounded-xl py-3 px-8 font-medium"
    >
      {isConnecting ? (
        <div className="flex items-center">
          <div className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
          Connecting...
        </div>
      ) : (
        <>
          Connect Wallet
        </>
      )}
    </Button>
  );
};

export default ConnectButton;
