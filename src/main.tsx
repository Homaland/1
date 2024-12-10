import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk';

import App from './App.tsx';
import './index.css';

// Уведомляем Telegram о готовности приложения
WebApp.ready();

// Рендерим React-приложение
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider
      manifestUrl="https://homaland-memefight-f32c.twc1.net/static/tonconnect-manifest.json"
    >
      <App />
    </TonConnectUIProvider>
  </StrictMode>
);
