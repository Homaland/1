import { useEffect, useRef } from 'react';
import { THEME, TonConnectUI } from "@tonconnect/ui";
// @ts-ignore
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
             <style scoped>{`
        #swap-widget-component {
          margin: 0 auto;
          width: 100%;
          height: 500px;
        }
      `}</style>
        </div>
    );
}

export default App;
