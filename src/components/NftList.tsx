// src/components/NftList.tsx

import React from 'react';

interface NftListProps {
  nftError: string | null;
  filteredNfts: any[] | undefined;  // Тип, который допускает как массив, так и undefined
  texts: any;
}

export const NftList: React.FC<NftListProps> = ({ nftError, filteredNfts, texts }) => {
  return (
    <div className="nft-list">
      <h3>{texts.yourNfts}</h3>
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
        <p>{texts.noCollectionFound}</p>
      )}
    </div>
  );
};
