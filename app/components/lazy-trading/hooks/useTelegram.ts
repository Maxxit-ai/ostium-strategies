import { TelegramUser } from "./useLazyTrading";

export function useTelegram(
  userWallet: string | undefined,
  setTelegramUser: (user: TelegramUser | null) => void,
  setLinkCode: (code: string) => void,
  setBotUsername: (username: string) => void,
  setDeepLink: (link: string) => void,
  setCheckingTelegram: (checking: boolean) => void,
  setError: (error: string) => void,
  setLoading: (loading: boolean) => void,
  setAgentId: (id: string) => void
) {
  const checkTelegramStatus = async (linkCode?: string) => {
    if (!userWallet) {
      console.log("[Telegram] Cannot check status: no wallet address");
      return;
    }

    setCheckingTelegram(true);
    try {
      const queryParams = new URLSearchParams({
        userWallet,
      });
      if (linkCode) {
        queryParams.append("linkCode", linkCode);
      }

      const response = await fetch(
        `/api/lazy-trading/check-telegram-status?${queryParams.toString()}`
      );
      const data = await response.json();

      if (data.success && data.connected && data.telegramUser) {
        setTelegramUser(data.telegramUser);
        if (data.agentId) {
          setAgentId(data.agentId);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("[Telegram] Error checking telegram status:", err);
      return false;
    } finally {
      setCheckingTelegram(false);
    }
  };

  const generateTelegramLink = async () => {
    if (!userWallet) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/lazy-trading/generate-telegram-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userWallet }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.alreadyLinked) {
          setTelegramUser(data.telegramUser);
        } else {
          setLinkCode(data.linkCode);
          setBotUsername(data.botUsername);
          setDeepLink(data.deepLink);
        }
      } else {
        setError(data.error || "Failed to generate link");
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate link");
    } finally {
      setLoading(false);
    }
  };

  return {
    checkTelegramStatus,
    generateTelegramLink,
  };
}

