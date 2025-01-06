import { useEffect, useRef } from 'react';
import { createSwapWidget } from '@swap-coffee/ui-sdk';

function App() {
    const manifestUrl = "https://swap.coffee/tonconnect-manifest.json";
    const widgetInitialized = useRef(false);

    useEffect(() => {
        if (!widgetInitialized.current) {
            createSwapWidget('#swap-widget-component', {
                theme: 'light',
                locale: 'ru',
                tonConnectManifest: {
                    url: manifestUrl,
                },
                injectionMode: 'tonConnect', // Использует глобальный TonConnect
            });

            widgetInitialized.current = true;
        }
    }, []);

    return (
        <div>
            <h1>Swap Widget Example</h1>
            <div id="swap-widget-component"></div>
        </div>
    );
}

export default App;
