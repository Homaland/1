import { useEffect, useMemo, useState } from "react";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { JettonBalance } from "@ton-api/client";

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

  const connectedAddressString = useTonAddress();
  const connectedAddress = useMemo(() => {
    return isValidAddress(connectedAddressString)
      ? Address.parse(connectedAddressString)
      : null;
  }, [connectedAddressString]);

  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState(1);

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

  return (
    <>
      {isLoading ? (
        <div className="loading-screen">
          <img src="https://i.postimg.cc/BnsnSb2h/IMG-9937.png" alt="Loading..." className="loading-image" />
          <TonConnectButton
            style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)" }}
          />
          <p>Connect your wallet{".".repeat(dots)}</p>
        </div>
      ) : (
        <div>
          <header>
           <h2>Hold On for Dear Reward</h2>
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
        </div>
      )}
    </>
  );
}

export default App;
