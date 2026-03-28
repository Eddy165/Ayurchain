import { useState, useEffect } from "react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useMetaMask = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const EXPECTED_CHAIN_ID = import.meta.env.VITE_CHAIN_ID || "80001"; // Mumbai
  const hexExpectedChainId = `0x${Number(EXPECTED_CHAIN_ID).toString(16)}`;

  const checkConnection = async () => {
    setIsLoading(true);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
        const currentChain = await window.ethereum.request({ method: "eth_chainId" });
        setChainId(currentChain);
        
        if (currentChain !== hexExpectedChainId) {
          toast.error("Wrong network. Please switch to Polygon Mumbai.");
        }
      } catch (err: any) {
        console.error("MetaMask connect error:", err);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      });

      window.ethereum.on("chainChanged", (newChainId: string) => {
        setChainId(newChainId);
        if (newChainId !== hexExpectedChainId) {
          toast.error("Wrong network. Please switch to Polygon Mumbai.");
        } else {
          toast.success("Network switched successfully");
        }
      });
    }
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not installed");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setIsConnected(true);
      
      const currentChain = await window.ethereum.request({ method: "eth_chainId" });
      if (currentChain !== hexExpectedChainId) {
        toast.error("Wrong network. Please switch to Polygon Mumbai.");
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: hexExpectedChainId }],
          });
        } catch (switchError) {
          console.error("Failed to switch network", switchError);
        }
      }
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to connect MetaMask");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    // Cannot truly disconnect MetaMask via API, just clear local state
    setAccount(null);
    setIsConnected(false);
  };

  return { account, chainId, isConnected, connect, disconnect, isLoading, error };
};
