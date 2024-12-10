import { useEffect, useMemo, useState } from "react";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { JettonBalance } from "@ton-api/client";

import WebApp from '@twa-dev/sdk';
import "./App.css";
import { isValidAddress } from "./utils/address";
import { JettonList } from "./components/JettonList";
import { SendJettonModal } from "./components/SendJettonModal";
import ta from "./tonapi";

function App() {
  const [jettons, setJettons] = useState<JettonBalance[] | null>(null);
  const [selectedJetton, setSelectedJetton] = useState<JettonBalance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nfts, setNfts] = useState<any[] | null>(null);
  const [nftError, setNftError] = useState<string | null>(null);
  const [hasHODRCollection, setHasHODRCollection] = useState<boolean | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Открытие настроек
  const [userName, setUserName] = useState<string | null>(null); // Имя пользователя
  const [userPhoto, setUserPhoto] = useState<string | null>(null); // Фото пользователя

  const connectedAddressString = useTonAddress();
  const connectedAddress = useMemo(() => {
    return isValidAddress(connectedAddressString)
      ? Address.parse(connectedAddressString)
      : null;
  }, [connectedAddressString]);

  const [isLoading, setIsLoading] = useState(true); // Статус загрузки
  const [dots, setDots] = useState(1); // Для анимации точек

  // Получение данных пользователя через Telegram Web Apps SDK
  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      const user = WebApp.initDataUnsafe.user;
      setUserName(user.first_name + (user.last_name ? ` ${user.last_name}` : ""));
      setUserPhoto(user.photo_url || null);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots % 3) + 1); // Меняем количество точек от 1 до 3
    }, 500);

    return () => clearInterval(interval); // Очищаем интервал при размонтировании
  }, []);

  useEffect(() => {
    if (!connectedAddress) {
      setJettons(null);
      setNfts(null);
      setHasHODRCollection(null);
      setIsLoading(true); // Показываем загрузочный экран
      return;
    }

    const loadingStartTime = Date.now(); // Запоминаем время начала загрузки

    const fetchData = async () => {
      try {
        const [jettonRes, nftRes] = await Promise.all([
          ta.accounts.getAccountJettonsBalances(connectedAddress),
          ta.accounts.getAccountNftItems(connectedAddress),
        ]);

        setJettons(jettonRes.balances);
        setNfts(nftRes.nftItems);
        checkHODRCollectionStatus(nftRes.nftItems);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Failed to fetch jettons");
        setNftError(e.message || "Failed to fetch NFTs");
        setJettons(null);
        setNfts(null);
        setHasHODRCollection(null);
      }

      const elapsedTime = Date.now() - loadingStartTime; // Время выполнения загрузки
      const remainingTime = Math.max(0, 3000 - elapsedTime); // Оставшееся время до 3 секунд

      setTimeout(() => setIsLoading(false), remainingTime); // Ждем оставшееся время перед скрытием загрузочного экрана
    };

    fetchData();
  }, [connectedAddress]);

  const checkHODRCollectionStatus = (nftItems: any[]) => {
    const collectionExists = nftItems.some(
      (nft) => nft.collection && nft.collection.name && nft.collection.name.includes("HODR")
    );
    setHasHODRCollection(collectionExists);
  };

  const filteredNfts = nfts?.filter((nft) => nft.collection);

  return (
    <>
      {/* Загрузочный экран с кнопкой TonConnect */}
      {isLoading ? (
        <div className="loading-screen">
          <img src="https://i.postimg.cc/BnsnSb2h/IMG-9937.png" alt="Loading..." className="loading-image" />
          <TonConnectButton style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)" }} />
          <p>Connect your wallet{".".repeat(dots)}</p>
        </div>
      ) : (
        <div>
          <header>
            <div className="user-info">
              {userPhoto && <img src={userPhoto} alt="User Avatar" className="user-avatar" />}
              {userName && (
                <p className="user-name" onClick={() => setIsSettingsOpen(true)}>
                  {userName}
                </p>
              )}
            </div>
            <h1>HODRLAND</h1>
          </header>

          <main>
            <JettonList
              className="card"
              jettons={jettons}
              connectedAddressString={connectedAddressString}
              onSendClick={setSelectedJetton}
            />
            {error && <p className="error">{error}</p>}

            {selectedJetton && connectedAddress && (
              <SendJettonModal
                senderAddress={connectedAddress}
                jetton={selectedJetton}
                onClose={() => setSelectedJetton(null)}
              />
            )}

            <div className="collection-status">
              <h3>Holder Status</h3>
              {hasHODRCollection !== null ? (
                hasHODRCollection ? (
                  <p style={{ color: "green" }}>✔️ HODR collection found!</p>
                ) : (
                  <p style={{ color: "red" }}>❌ No HODR collection found.</p>
                )
              ) : (
                <p>Loading...</p>
              )}

              <div className="nft-list">
                <h3>Your NFTs</h3>
                {nftError && <p className="error">{nftError}</p>}
                {filteredNfts && filteredNfts.length > 0 ? (
                  <ul className="nft-grid">
                    {filteredNfts.map((nft, index) => (
                      <li key={index} className="nft-item">
                        <p>{nft.name ? nft.name : `NFT ${index + 1}`}</p>
                        {nft.collection && <p className="nft-collection">Collection: {nft.collection.name}</p>}
                        {nft.previews && nft.previews.length >= 3 ? (
                          <div className="nft-image-wrapper">
                            <img
                              src={nft.previews[2].url}
                              alt={nft.name || `NFT ${index + 1}`}
                              className="nft-image"
                              style={{ width: "25vw", height: "auto" }}
                            />
                          </div>
                        ) : (
                          <p>No third preview available</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No NFTs with a collection found</p>
                )}
              </div>
            </div>
          </main>

          {/* Модальное окно настроек */}
          {isSettingsOpen && (
            <div className="settings-modal">
              <h2>Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)}>Close</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
