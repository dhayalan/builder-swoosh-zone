import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ethers } from "ethers";

export default function Index() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  const handleReload = () => {
    // QR code will be generated from backend
    console.log("Reloading satellite data...");
  };

  const handleSave = () => {
    console.log("Saving NFT data...");
  };

  const handlePayment = () => {
    console.log("Processing payment...");
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setWalletError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setWalletError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);

        // Optional: Switch to Avalanche network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xA86A' }], // Avalanche C-Chain
          });
        } catch (switchError: any) {
          // If the chain hasn't been added to MetaMask, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0xA86A',
                    chainName: 'Avalanche Network',
                    nativeCurrency: {
                      name: 'AVAX',
                      symbol: 'AVAX',
                      decimals: 18,
                    },
                    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
                    blockExplorerUrls: ['https://snowtrace.io/'],
                  },
                ],
              });
            } catch (addError) {
              console.error('Failed to add Avalanche network:', addError);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      if (error.code === 4001) {
        setWalletError('Connection rejected by user.');
      } else {
        setWalletError('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setWalletError(null);
  };

  // Check if wallet is already connected on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
        }
      });

      window.ethereum.on('chainChanged', () => {
        // Reload the page when chain changes
        window.location.reload();
      });
    }

    // Cleanup listeners
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Stars background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:50px_50px] opacity-20"></div>
      
      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center gap-4">
          {/* AVA Logo */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 rounded-lg shadow-lg">
            <div className="text-white font-bold text-2xl tracking-wider">AVA</div>
          </div>
        </div>
        
        {walletAddress ? (
          <div className="flex items-center gap-3">
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {formatAddress(walletAddress)}
            </div>
            <Button
              onClick={disconnectWallet}
              variant="outline"
              className="text-slate-300 border-slate-600 hover:bg-slate-700 px-4 py-2 text-sm"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 px-6 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        )}
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-6 py-8 gap-8">
        {/* Left Side - Satellite Image and Description */}
        <div className="flex-1 flex flex-col items-center lg:items-start space-y-6">
          {/* Satellite Image Container */}
          <div className="relative">
            <div className="w-96 h-64 lg:w-[500px] lg:h-[300px] bg-gradient-to-b from-blue-900 to-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
              {/* Earth curve at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-400 via-blue-500 to-transparent rounded-b-xl"></div>
              
              {/* Satellite representation */}
              <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  {/* Satellite body */}
                  <div className="w-16 h-12 bg-slate-300 rounded-sm shadow-lg"></div>
                  {/* Solar panels */}
                  <div className="absolute -left-8 top-2 w-6 h-8 bg-blue-800 rounded-sm"></div>
                  <div className="absolute -right-8 top-2 w-6 h-8 bg-blue-800 rounded-sm"></div>
                  {/* Antenna */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-slate-400"></div>
                </div>
              </div>
              
              {/* Stars */}
              <div className="absolute top-4 left-8 w-1 h-1 bg-white rounded-full"></div>
              <div className="absolute top-12 right-12 w-1 h-1 bg-white rounded-full"></div>
              <div className="absolute top-8 right-20 w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Description Text */}
          <div className="max-w-md text-center lg:text-left">
            <p className="text-white text-sm lg:text-base leading-relaxed">
              Turning real-time satellite telemetry from ESP32 sensors into 
              tradeable NFTs, this project stores sensor data on IPFS and mints it as 
              ERC-721 tokens on Avalanche. Each NFT represents a unique 
              snapshot of environmental data, publicly viewable and 
              verifiable using AVAX.
            </p>
          </div>
        </div>

        {/* Right Side - NFT Controls Panel */}
        <div className="flex-shrink-0">
          <Card className="bg-slate-100 p-6 rounded-xl shadow-2xl border border-slate-300 w-80">
            <div className="space-y-6">
              {/* Title */}
              <h2 className="text-lg font-semibold text-slate-800 text-center">
                Real Time NFT Satellite Telemetry NFT
              </h2>

              {/* QR Code Placeholder */}
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-slate-200 border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center">
                  {qrCode ? (
                    <img src={qrCode} alt="QR Code" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center text-slate-500">
                      <div className="grid grid-cols-8 gap-1 p-4">
                        {Array.from({ length: 64 }, (_, i) => (
                          <div 
                            key={i} 
                            className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-slate-400' : 'bg-transparent'} rounded-sm`}
                          ></div>
                        ))}
                      </div>
                      <p className="text-xs mt-2">QR Code will be generated</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleReload}
                  variant="outline"
                  className="bg-slate-600 hover:bg-slate-700 text-white border-slate-500 px-6"
                >
                  Reload
                </Button>
                <Button
                  onClick={handleSave}
                  variant="outline"
                  className="bg-slate-600 hover:bg-slate-700 text-white border-slate-500 px-6"
                >
                  Save
                </Button>
              </div>

              {/* Wallet Status */}
              {walletError && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                  {walletError}
                </div>
              )}

              {walletAddress && (
                <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg border border-green-200">
                  Wallet Connected: {formatAddress(walletAddress)}
                </div>
              )}

              {/* Payment Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handlePayment}
                  disabled={!walletAddress}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Payment
                </Button>
              </div>

              {!walletAddress && (
                <div className="text-slate-500 text-xs text-center">
                  Connect your wallet to enable payment
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
