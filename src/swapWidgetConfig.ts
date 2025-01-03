// swapWidgetConfig.ts
import { THEME } from "@tonconnect/ui";

// TonConnect manifest URL
const manifestUrl = "https://swap.coffee/tonconnect-manifest.json";

// TonConnect конфигурация
export const tonConnectConfig = {
  manifestUrl: manifestUrl,
  uiPreferences: {
    theme: THEME.DARK,
  },
};

// Swap Widget конфигурация
export const swapWidgetConfig = {
  theme: 'dark',
  injectionMode: 'tonConnect',
  locale: 'en',
  tonConnectManifest: {
    url: manifestUrl,
  }
};
