declare module '@swap-coffee/ui-sdk' {
    export function createSwapWidget(
        containerSelector: string,
        options: {
            theme: 'light' | 'dark' | 'coffee';
            locale: 'zh' | 'ua' | 'ru' | 'en' | 'es' | 'fr' | 'fa';
            tonConnectManifest: { url: string };
            injectionMode: 'tonConnect' | 'payload';
            tonConnectUi: any;
        }
    ): void;
}
