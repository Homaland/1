import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk'; // Импорт Telegram Web Apps SDK

import App from './App.tsx';
import './index.css';

// Telegram WebApp initialization
WebApp.ready();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <TonConnectUIProvider
            manifestUrl="https://fefefefe.fun/static/tonconnect-manifest.json"
        // ... other parameters
        actionsConfiguration={{
            twaReturnUrl: 'https://t.me/HODRBOT/HODR'
        }}
        >
            <App />
        </TonConnectUIProvider>
    </StrictMode>,
);
