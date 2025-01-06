import { useEffect, useRef } from 'react';
import { createSwapWidget } from '@swap-coffee/ui-sdk';
import { useTonConnectUI } from '@tonconnect/ui-react'; // Импортируем хук

function App() {
    const manifestUrl = "https://swap.coffee/tonconnect-manifest.json";
    const widgetInitialized = useRef(false);
    const [tonConnectUi] = useTonConnectUI(); // Получаем экземпляр TonConnectUI

    useEffect(() => {
        if (!widgetInitialized.current) {
            createSwapWidget('#swap-widget-component', {
                theme: 'light',
                locale: 'ru',
                tonConnectManifest: {
                    url: manifestUrl,
                },
                injectionMode: 'tonConnect',
                tonConnectUi: tonConnectUi, // Передаем существующий экземпляр
            });

            widgetInitialized.current = true;
        }
    }, [tonConnectUi]);

    return (
        <div>
            <h1>Swap Widget Example</h1>
            <div id="swap-widget-component"></div>
        </div>
    );
}

export default App;
