/**
 * Telegram Bot Service
 * Handles all Telegram Bot API interactions for Lazy Trading
 */

export interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    first_name: string;
    username?: string;
  };
  chat: {
    id: number;
    type: string;
  };
  text?: string;
  date: number;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: {
    id: string;
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    message: TelegramMessage;
    data: string;
  };
}

export class TelegramBot {
  private botToken: string;
  private apiBase: string;

  constructor(botToken?: string) {
    this.botToken = botToken || process.env.TELEGRAM_BOT_TOKEN || '';
    this.apiBase = `https://api.telegram.org/bot${this.botToken}`;
    
    if (!this.botToken) {
      console.warn('[TelegramBot] Warning: No bot token configured');
    }
  }

  /**
   * Send a text message
   */
  async sendMessage(chatId: number | string, text: string, options?: {
    reply_markup?: any;
    parse_mode?: 'HTML' | 'Markdown';
  }): Promise<void> {
    try {
      const response = await fetch(`${this.apiBase}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          ...options,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Telegram API error: ${error}`);
      }
    } catch (error: any) {
      console.error('[TelegramBot] Send message error:', error.message);
      throw error;
    }
  }

  /**
   * Send a message with inline buttons
   */
  async sendMessageWithButtons(chatId: number | string, text: string, buttons: Array<Array<{ text: string; callback_data: string }>>) {
    await this.sendMessage(chatId, text, {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  }

  /**
   * Answer callback query (button click)
   */
  async answerCallback(callbackQueryId: string, text?: string): Promise<void> {
    try {
      await fetch(`${this.apiBase}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: callbackQueryId,
          text,
        }),
      });
    } catch (error: any) {
      console.error('[TelegramBot] Answer callback error:', error.message);
    }
  }

  /**
   * Set webhook URL
   */
  async setWebhook(url: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBase}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      return result.ok;
    } catch (error: any) {
      console.error('[TelegramBot] Set webhook error:', error.message);
      return false;
    }
  }

  /**
   * Get bot info
   */
  async getMe(): Promise<any> {
    try {
      const response = await fetch(`${this.apiBase}/getMe`);
      const result = await response.json();
      return result.result;
    } catch (error: any) {
      console.error('[TelegramBot] Get me error:', error.message);
      return null;
    }
  }

  /**
   * Generate a one-time link code
   */
  generateLinkCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

export function createTelegramBot(botToken?: string): TelegramBot {
  return new TelegramBot(botToken);
}

