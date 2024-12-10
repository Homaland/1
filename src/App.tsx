import { useEffect, useMemo, useState } from "react";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { JettonBalance } from "@ton-api/client";

import "./App.css";
import { isValidAddress } from "./utils/address";
import { JettonList } from "./components/JettonList";
import { SendJettonModal } from "./components/SendJettonModal";
import ta from "./tonapi";

// Интерфейс для атрибутов NFT
interface NftAttribute {
  trait_type: string;
  value: string;
}

function App() {
  const [jettons, setJettons] = useState<JettonBalance[] | null>(null);
  const [selectedJetton, setSelectedJetton] = useState<JettonBalance | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [nfts, setNfts] = useState<any[] | null>(null); // Исправлено на 'any', если тип NftItemWithPreview неверен
  const [nftError, setNftError] = useState<string | null>(null);

  const connectedAddressString = useTonAddress();
  const connectedAddress = useMemo(() => {
    return isValidAddress(connectedAddressString)
      ? Address.parse(connectedAddressString)
      : null;
  }, [connectedAddressString]);

  useEffect(() => {
    if (!connectedAddress) {
      setJettons(null);
      setNfts(null);
      return;
    }

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
        setNfts(res.nftItems); // Используем правильный тип для ответа
      })
      .catch((e: Error) => {
        console.error(e);
        setNftError(e.message || "Failed to fetch NFTs");
        setNfts(null);
      });
  }, [connectedAddress]);

  // Фильтрация NFT, чтобы показывать только те, у которых есть коллекция
  const filteredNfts = nfts?.filter((nft) => nft.collection);

  return (
    <>
      <header>
        <TonConnectButton style={{ marginLeft: "auto" }} />
        <h1>HODRLAND</h1>
      </header>

      <main>
        {/* Список жетонов */}
        <JettonList
          className="card"
          jettons={jettons}
          connectedAddressString={connectedAddressString}
          onSendClick={setSelectedJetton}
        />
        {error && <p className="error">{error}</p>}

        {/* Модальное окно для отправки жетона */}
        {selectedJetton && connectedAddress && (
          <SendJettonModal
            senderAddress={connectedAddress}
            jetton={selectedJetton}
            onClose={() => setSelectedJetton(null)}
          />
        )}

        {/* Список NFT с превью */}
        <div className="nft-list">
          <h2>Your NFTs</h2>
          {nftError && <p className="error">{nftError}</p>}
          {filteredNfts && filteredNfts.length > 0 ? (
            <ul className="nft-grid">
              {filteredNfts.map((nft, index) => (
                <li key={index} className="nft-item">
                  {/* Название NFT */}
                  <p>{nft.name ? nft.name : `NFT ${index + 1}`}</p>

                  {/* Название коллекции */}
                  {nft.collection && <p className="nft-collection">Collection: {nft.collection.name}</p>}

                  {/* Показ третьего изображения превью NFT */}
                  {nft.previews && nft.previews.length >= 3 ? (
                    <div className="nft-image-wrapper">
                      <img
                        src={nft.previews[2].url}
                        alt={nft.name || `NFT ${index + 1}`}
                        className="nft-image"
                        style={{ width: "25vw", height: "auto" }} // 10% от ширины экрана
                      />
                    </div>
                  ) : (
                    <p>No third preview available</p>
                  )}

                  {/* Атрибуты NFT */}
                  {nft.attributes && nft.attributes.length > 0 && (
                    <div className="nft-attributes">
                      <h4>Attributes:</h4>
                      <ul>
                        {nft.attributes.map((attr: NftAttribute, attrIndex: number) => (
                          <li key={attrIndex}>
                            <strong>{attr.trait_type}: </strong>
                            {attr.value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No NFTs with a collection found</p>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
