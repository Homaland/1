import { useEffect, useMemo, useState } from "react";
import { useTonAddress } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { JettonBalance } from "@ton-api/client";
import WebApp from '@twa-dev/sdk';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BottomMenu from "./components/BottomMenu";
import Header from "./components/Header";
import { SticList } from "./components/SticList";
import CollectionStatus from "./components/CollectionStatus";
import ButtonRow from "./components/ButtonRow";

// Прочие импорты для страниц
import TaskPage from "./pages/TaskPage";
import PlayPage from "./pages/PlayPage";
import ShopPage from "./pages/ShopPage";
import TradePage from "./pages/TradePage";
import JettonDetailsPage from "./pages/JettonDetailsPage";
import Tokeninfo from "./pages/TokenInfoPage";
import { NftList } from './components/NftList'; 

import { io } from "socket.io-client";

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

 
  const [balance, setBalance] = useState<number | null>(null);

  

const socket = io("http://homaland-hodrland-04a0.twc1.net");

useEffect(() => {
    if (WebApp.initDataUnsafe && WebApp.initDataUnsafe.user) {
        const telegramId = WebApp.initDataUnsafe.user.id;

        socket.emit("get_balance", { telegram_id: telegramId });

        socket.on("balance", (data) => {
            setBalance(data.balance);
        });

        socket.on("error", (error) => {
            console.error("Socket error:", error.message);
        });
    }

    return () => {
        socket.disconnect();
    };
}, []);

  
  

  // Save language to localStorage whenever it changes
  useEffect(() => {
    saveLanguage(language);
  }, [language]);

  
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

  
  // Fetch user Telegram data
  useEffect(() => {
    if (WebApp.initDataUnsafe && WebApp.initDataUnsafe.user) {
      setFirstName(WebApp.initDataUnsafe.user.first_name);
      setProfilePhotoUrl(WebApp.initDataUnsafe.user.photo_url ?? null);  // Применили оператор ?? вместо ||
    }
  }, []);
 
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (connectedAddress) {
        
      }
    }, 0);

    if (!connectedAddress) {
      setJettons(null);
      setNfts(null);
      setHasHODRCollection(null);
      
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
       (          
        
              <div className="main-content">

                
                         <Header profilePhotoUrl={profilePhotoUrl} firstName={firstName} /> {/* Use Header component */}
          <div className="content">
                        <SticList />
                        <ButtonRow jettons={jettons} setSelectedJetton={setSelectedJetton} />
<div className="how-it-works">  <p>Hold On for Dear Reward</p> </div>
<div className="tokenhodr">


              <Tokeninfo />
            </div>
            <div className="earncard">
            {balance !== null ? (
  <p>Your points: {balance}</p>
) : error ? (
  <p>Error fetching balance: {error}</p>
) : (
  <p>Loading your points...</p>
)}
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
              <CollectionStatus hasHODRCollection={hasHODRCollection} texts={texts} />
 <NftList
                    nftError={nftError}
                    filteredNfts={filteredNfts}
                    texts={texts}
                  />
                       </div>
            <BottomMenu />
          </div>
        )
      } />

      <Route path="/task" element={<TaskPage />} />
      <Route path="/play" element={<PlayPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/trade" element={<TradePage />} />
      
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
