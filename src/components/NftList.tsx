import React, { useEffect, useState } from "react";
import { useTonAddress } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import ta from "../tonapi";

interface NftItem {
  name: string;
  description?: string;
  imageUrl?: string;
}

export const NftList: React.FC = () => {
  const [nfts, setNfts] = useState<NftItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectedAddressString = useTonAddress();
  const connectedAddress = connectedAddressString
    ? Address.parse(connectedAddressString)
    : null;

  useEffect(() => {
    if (!connectedAddress) {
      setNfts(null);
      return;
    }

    ta.accounts
      .getAccountNfts(connectedAddress)
      .then((res) => {
        setNfts(res.items.map((nft: any) => ({
          name: nft.name,
          description: nft.description,
          imageUrl: nft.image,
        })));
      })
      .catch((e) => {
        console.error(e);
        setError(e.message || "Failed to fetch NFTs");
        setNfts(null);
      });
  }, [connectedAddress]);

  if (!connectedAddress) {
    return <p>Please connect your wallet to view NFTs.</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!nfts) {
    return <p>Loading NFTs...</p>;
  }

  if (nfts.length === 0) {
    return <p>No NFTs found for the connected wallet.</p>;
  }

  return (
    <div className="nft-list">
      <h2>Your NFTs</h2>
      <ul>
        {nfts.map((nft, index) => (
          <li key={index} className="nft-item">
            {nft.imageUrl && <img src={nft.imageUrl} alt={nft.name} />}
            <div>
              <h3>{nft.name}</h3>
              {nft.description && <p>{nft.description}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
