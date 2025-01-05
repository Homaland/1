declare module '@swap-coffee/ui-sdk' {
    export function createSwapWidget(
        containerId: string, 
        options: {
            theme: string;
            locale: string;
            tonConnectManifest: { url: string };
            injectionMode: string;
            tonConnectUi: any;
        }
    ): void;
}
