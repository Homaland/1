import { useEffect, useMemo, useState } from "react";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { JettonBalance } from "@ton-api/client";
import WebApp from '@twa-dev/sdk';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BottomMenu from "./components/BottomMenu";
import Header from "./components/Header";
import { SticList } from "./components/SticList";


// Прочие импорты для страниц
import TaskPage from "./pages/TaskPage";
import PlayPage from "./pages/PlayPage";
import ShopPage from "./pages/ShopPage";
import FrenPage from "./pages/FrenPage";
import JettonDetailsPage from "./pages/JettonDetailsPage";
import Tokeninfo from "./pages/TokenInfoPage";
import { NftList } from './components/NftList'; 

import "./App.css";
import { isValidAddress } from "./utils/address";
import { JettonList } from "./components/JettonList";
import { SendJettonModal } from "./components/SendJettonModal";
import ta from "./tonapi";
import SettingsPage from "./pages/SettingsPage";  // Import settings page
import { getText, loadLanguage, saveLanguage, Language } from "./components/languageUtils";

function App() {
  const [jettons, setJettons] = useState<JettonBalance[] | null>(null);
  const [selectedJetton, setSelectedJetton] = useState<JettonBalance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nfts, setNfts] = useState<any[] | null>(null);
  const [nftError, setNftError] = useState<string | null>(null);
  const [hasHODRCollection, setHasHODRCollection] = useState<boolean | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);

  const [language, setLanguage] = useState<Language>(loadLanguage().toUpperCase() as Language);


  const connectedAddressString = useTonAddress();
  const connectedAddress = useMemo(() => {
    return isValidAddress(connectedAddressString)
      ? Address.parse(connectedAddressString)
      : null;
  }, [connectedAddressString]);

  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState(1);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    saveLanguage(language);
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

  const texts = getText(language);

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
        
              <p>{texts.connectWallet}{".".repeat(dots)}</p>
            </div>
          ) : (
           
              <div className="main-content">
           
              <Header profilePhotoUrl={profilePhotoUrl} firstName={firstName} /> {/* Use Header component */}


          <div className="content">
              
          <SticList />

      <div className="button-row">
  {/* Кнопка "Arrow Circle Up" */}
  <div className="button-container">
    <div
      className="action-button"
      onClick={() => WebApp.showAlert("Soon")}
    >
      <img
        src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/img/arrow_downward_36dp_000000_FILL0_wght400_GRAD0_opsz40.svg"
        alt="Receive"
        className="icon"
      />
      <p className="button-text">Receive</p>
    </div>
  </div>

  {/* Кнопка "Arrow Circle Down" */}
  <div className="button-container">
    <div
      className="action-button"
      onClick={() => setSelectedJetton(jettons ? jettons[0] : null)}
    >
      <img
        src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/img/arrow_upward_36dp_000000_FILL0_wght400_GRAD0_opsz40.svg"
        alt="Send"
        className="icon"
      />
      <p className="button-text">Send</p>
    </div>
  </div>

  {/* Кнопка "Swap Vert" */}
  <div className="button-container">
    <div
      className="action-button"
      onClick={() => WebApp.showAlert("Soon")}
    >
      <img
        src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/img/swap_vert_36dp_000000_FILL0_wght400_GRAD0_opsz40.svg"
        alt="Swap"
        className="icon"
      />
      <p className="button-text">Swap</p>
    </div>
  </div>
</div>



<div className="how-it-works">  <p>Hold On for Dear Reward</p> </div>


<div className="tokenhodr">
             
              <Tokeninfo />
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
 
<div
  className="jetton-list-link"
  onClick={() => window.location.href = '/jettons'}
>
  <JettonList
   className="card"
    jettons={jettons}
    connectedAddressString={connectedAddressString}
    onSendClick={setSelectedJetton}
  />
</div>

  
  

              {error && <p className="error">{error}</p>}

              <div className="collection-status">
              <div className="cstatus">  
              <h3>{texts.holderStatus}</h3>
                {hasHODRCollection !== null ? (
                  hasHODRCollection ? (
                    <p style={{ color: "green" }}>{texts.hodrCollectionFound}</p>
                  ) : (
                    <p style={{ color: "red" }}>{texts.hodrCollectionNotFound}</p>
                  )
                ) : (
                  <p>{texts.noCollectionFound}</p>
                )}
 </div>
 <NftList
                    nftError={nftError}
                    filteredNfts={filteredNfts}
                    texts={texts}
                  />

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
      connectedAddressString={connectedAddressString}
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