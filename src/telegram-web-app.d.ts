declare global {
    interface TelegramWebAppUser {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    }
  
    interface TelegramWebApp {
      initDataUnsafe: {
        user?: TelegramWebAppUser;
        query_id?: string;
        auth_date?: number;
        hash?: string;
      };
      close(): void;
      expand(): void;
      onEvent(eventType: string, callback: () => void): void;
    }
  
    const TelegramWebApp: TelegramWebApp;
  }
  
  export {};
  