import { useEffect, useMemo, useState } from "react";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { JettonBalance } from "@ton-api/client";
import WebApp from '@twa-dev/sdk';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import BottomMenu from "./components/BottomMenu";


// Прочие импорты для страниц
import TaskPage from "./pages/TaskPage";
import PlayPage from "./pages/PlayPage";
import ShopPage from "./pages/ShopPage";
import FrenPage from "./pages/FrenPage";
import JettonDetailsPage from "./pages/JettonDetailsPage";

import "./App.css";
import { isValidAddress } from "./utils/address";
import { JettonList } from "./components/JettonList";
import { SendJettonModal } from "./components/SendJettonModal";
import ta from "./tonapi";
import SettingsPage from "./pages/SettingsPage";  // Import settings page

type Language = "RU" | "ENG";

function App() {
  const [jettons, setJettons] = useState<JettonBalance[] | null>(null);
  const [selectedJetton, setSelectedJetton] = useState<JettonBalance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nfts, setNfts] = useState<any[] | null>(null);
  const [nftError, setNftError] = useState<string | null>(null);
  const [hasHODRCollection, setHasHODRCollection] = useState<boolean | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);

  const [language, setLanguage] = useState<Language>("ENG");  // Default language ENG

  const connectedAddressString = useTonAddress();
  const connectedAddress = useMemo(() => {
    return isValidAddress(connectedAddressString)
      ? Address.parse(connectedAddressString)
      : null;
  }, [connectedAddressString]);

  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState(1);

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  

  useEffect(() => {
    if (WebApp.initDataUnsafe && WebApp.initDataUnsafe.user) {
      setFirstName(WebApp.initDataUnsafe.user.first_name);
      setProfilePhotoUrl(WebApp.initDataUnsafe.user.photo_url || null);
    }
  }, []);

  // Управление полноэкранным режимом и запрет свайпа вниз для закрытия приложения
  useEffect(() => {
    // Запросить переход в полноэкранный режим
    WebApp.requestFullscreen();

    // Отключаем возможность свайпа вниз для закрытия приложения
    WebApp.isVerticalSwipesEnabled = false;

    // Включаем подтверждение закрытия
    WebApp.enableClosingConfirmation();

  }, []);

  // Управление безопасными зонами
  useEffect(() => {
    // Убираем отступы для безопасных зон
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Fetch user Telegram data
  useEffect(() => {
    if (WebApp.initDataUnsafe && WebApp.initDataUnsafe.user) {
      setFirstName(WebApp.initDataUnsafe.user.first_name);
      setProfilePhotoUrl(WebApp.initDataUnsafe.user.photo_url ?? null);  // Применили оператор ?? вместо ||
    }
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots % 3) + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (connectedAddress) {
        setIsLoading(false);
      }
    }, 3000);

    if (!connectedAddress) {
      setJettons(null);
      setNfts(null);
      setHasHODRCollection(null);
      setIsLoading(true);
    } else {
      ta.accounts
        .getAccountJettonsBalances(connectedAddress)
        .then((res) => setJettons(res.balances))
        .catch((e: Error) => {
          console.error(e);
          setError(e.message || "Failed to fetch jettons");
          setJettons(null);
        });

      ta.accounts
        .getAccountNftItems(connectedAddress)
        .then((res) => {
          setNfts(res.nftItems);
          checkHODRCollectionStatus(res.nftItems);
        })
        .catch((e: Error) => {
          console.error(e);
          setNftError(e.message || "Failed to fetch NFTs");
          setNfts(null);
          setHasHODRCollection(null);
        });
    }

    return () => clearTimeout(loadingTimeout);
  }, [connectedAddress]);

  const checkHODRCollectionStatus = (nftItems: any[]) => {
    const collectionExists = nftItems.some(
      (nft) => nft.collection && nft.collection.name && nft.collection.name.includes("HODR")
    );
    setHasHODRCollection(collectionExists);
  };

  const filteredNfts = nfts?.filter((nft) => nft.collection);

  const texts = {
    RU: {
      connectWallet: "Подключите кошелек",
      holderStatus: "Статус владельца",
      hodrCollectionFound: "✔️ Коллекция HODR найдена!",
      hodrCollectionNotFound: "❌ Коллекция HODR не найдена.",
      noCollectionFound: "Нет коллекции",
      yourNfts: "Ваши NFTs"
    },
    ENG: {
      connectWallet: "Connect your wallet",
      holderStatus: "Holder Status",
      hodrCollectionFound: "✔️ HODR collection found!",
      hodrCollectionNotFound: "❌ No HODR collection found.",
      noCollectionFound: "No collection found",
      yourNfts: "Your NFTs"
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          isLoading ? (
            <div className="loading-screen">
              <img src="https://i.postimg.cc/BnsnSb2h/IMG-9937.png" alt="Loading..." className="loading-image" />
              <TonConnectButton
                style={{ position: "absolute", top: "10vh", left: "50%", transform: "translateX(-50%)" }}
              />
              <p>{texts[language].connectWallet}{".".repeat(dots)}</p>
            </div>
          ) : (
           
              <div className="main-content">
           
              <header>
  <div className="profile-header">
  {profilePhotoUrl ? (
    <img
      src={profilePhotoUrl}
      alt="Telegram Profile"
      className="profile-photo"
    />
  ) : null}

  {firstName ? (
    <Link to="/settings" className="user-name">
      {firstName.length > 12 ? `${firstName.substring(0, 12)}...` : firstName}
      {/* Иконка стрелки */}
      <span className="arrow-icon">
        <i className="material-icons">arrow_forward_ios</i>
      </span>
    </Link>
  ) : (
    <Link to="/settings" className="user-name">
      User
      {/* Иконка стрелки */}
      <span className="arrow-icon">
        <i className="material-icons">arrow_forward_ios</i>
      </span>
    </Link>
  )}

  <TonConnectButton className="ton-connect-button" />
</div>

              </header>

          <div className="content">
                <h2>Hold On for Dear Reward</h2>
       <div className="stic-list">
  <div className="stic-carousel">
    {/* Каждый stic-item теперь содержит одно изображение */}
    <div className="stic-item">
      <img
        className="stic-image"
        src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/HODR.png"
        alt="Background"
      />
    </div>
    <div className="stic-item">
      <img
        className="stic-image"
        src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/IMG_0090.png"
        alt="Background"
      />
    </div>
    <div className="stic-item">
      <img
        className="stic-image"
        src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/IMG_0084-ezgif.com-optimize.gif"
        alt="Background"
      />
    </div>
    <div className="stic-item">
      <img
        className="stic-image"
        src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/IMG_0091.png"
        alt="Background"
      />
    </div>
    <div className="stic-item">
      <img
        className="stic-image"
        src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/IMG_0092.png"
        alt="Background"
      />
    </div>
  </div>
</div>

    {selectedJetton && connectedAddress && (
                <SendJettonModal
                  senderAddress={connectedAddress}
                  jetton={selectedJetton}
                  onClose={() => setSelectedJetton(null)}
                  jettons={jettons || []}
                  isVisible={!!selectedJetton} // Передаем состояние видимости
                />
              )}
 
 <Link to="/jettons" className="jetton-list-link">
  <JettonList
    className="card"
    jettons={jettons}
    connectedAddressString={connectedAddressString}
    onSendClick={setSelectedJetton}
  />
</Link>

              {error && <p className="error">{error}</p>}

              <div className="collection-status">
              <div className="cstatus">  <h3>{texts[language].holderStatus}</h3>
                {hasHODRCollection !== null ? (
                  hasHODRCollection ? (
                    <p style={{ color: "green" }}>{texts[language].hodrCollectionFound}</p>
                  ) : (
                    <p style={{ color: "red" }}>{texts[language].hodrCollectionNotFound}</p>
                  )
                ) : (
                  <p>{texts[language].noCollectionFound}</p>
                )}
 </div>
               <div className="nft-list">
  <h3>{texts[language].yourNfts}</h3>
  {nftError && <p className="error">{nftError}</p>}
  {filteredNfts && filteredNfts.length > 0 ? (
    <ul className="nft-carousel">
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
              />
            </div>
          ) : (
            <p>No third preview available</p>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p>{texts[language].noCollectionFound}</p>
  )}
</div>

              </div>
          </div>
            <BottomMenu />
          </div>
        )
      } />

      <Route path="/task" element={<TaskPage />} />
      <Route path="/play" element={<PlayPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/fren" element={<FrenPage />} />
      <Route
  path="/jettons"
  element={
    <JettonDetailsPage
      jettons={jettons}
      connectedAddressString={connectedAddressString || ""}
      onSendClick={setSelectedJetton}
    />
  }
/>

      

      <Route path="/settings" element={<SettingsPage language={language} setLanguage={setLanguage} />} />
    </Routes>
  </Router>
  );
}

export default App;
