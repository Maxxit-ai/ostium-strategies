import { ethers } from "ethers";

export function useEthSending(
  userWallet: string | undefined,
  ostiumAgentAddress: string,
  setSendingEth: (sending: boolean) => void,
  setEthTxHash: (hash: string | null) => void,
  setEthError: (error: string | null) => void
) {
  const handleSendETH = async (ethAmount: string) => {
    if (!ostiumAgentAddress || !ethAmount || parseFloat(ethAmount) <= 0) {
      setEthError("Please enter a valid ETH amount");
      return;
    }

    if (!userWallet) {
      setEthError("Please connect your wallet first");
      return;
    }

    setSendingEth(true);
    setEthError(null);
    setEthTxHash(null);

    try {
      const provider = (window as any).ethereum;
      if (!provider) {
        throw new Error("No wallet provider found.");
      }

      const ethersProvider = new ethers.providers.Web3Provider(provider);
      await ethersProvider.send("eth_requestAccounts", []);

      const amountInWei = ethers.utils.parseEther(ethAmount);

      const txHash = await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: userWallet,
            to: ostiumAgentAddress,
            value: amountInWei.toHexString(),
          },
        ],
      });

      setEthTxHash(txHash);
      await ethersProvider.waitForTransaction(txHash);

      console.log("[LazyTrading] ETH sent successfully:", txHash);
    } catch (err: any) {
      if (err.code === 4001 || err.message?.includes("rejected")) {
        setEthError("Transaction rejected");
      } else {
        setEthError(err.message || "Failed to send ETH");
      }
    } finally {
      setSendingEth(false);
    }
  };

  return {
    handleSendETH,
  };
}

