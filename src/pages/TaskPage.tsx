
import { useEffect, useRef } from 'react';
import { THEME, TonConnectUI } from "@tonconnect/ui";
import { createSwapWidget } from '@swap-coffee/ui-sdk';

function App() {
    const manifestUrl = "https://swap.coffee/tonconnect-manifest.json";
    const widgetInitialized = useRef(false);

    const tonConnectSettings = {
        manifestUrl: manifestUrl,
        uiPreferences: {
            theme: THEME.DARK,
        },
    };

    useEffect(() => {
        if (!widgetInitialized.current) {
            const tonConnectUiInstance = new TonConnectUI(tonConnectSettings);

            createSwapWidget('#swap-widget-component', {
                theme: 'light',
                locale: 'ru',
                tonConnectManifest: {
                    url: manifestUrl,
                },
                injectionMode: 'tonConnect',
                tonConnectUi: tonConnectUiInstance,
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
