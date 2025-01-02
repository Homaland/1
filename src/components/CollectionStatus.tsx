import React, { useState, useEffect } from 'react';

interface CollectionStatusProps {
  hasHODRCollection: boolean | null;
  texts: any;
}

const CollectionStatus: React.FC<CollectionStatusProps> = ({ hasHODRCollection, texts }) => {
  const [loading, setLoading] = useState(true); // Состояние загрузки

  useEffect(() => {
    // Эмулируем задержку загрузки
    const timer = setTimeout(() => setLoading(false), 2000); // Убираем заглушки через 2 секунды
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    // Заглушки
    return (
      <div className="collection-status skeleton-collection-status">
        <div className="cstatus">
          <h3 className="skeleton-text" />
          <div className="skeleton-status" />
          <div className="skeleton-no-collection">
            <div className="skeleton-line" />
          </div>
        </div>
        <style>
          {`
            .skeleton-collection-status {
              display: flex;
              justify-content: center;
              align-items: center;
  
            }
           
            .skeleton-text {
              width: 150px;
              height: 20px;
              background-color: #e0e0e0;
              margin-bottom: 10px;
              border-radius: 8px;
            }
            .skeleton-status {
              width: 150px;          
              height: 2vh;
              background-color: #e0e0e0;
              border-radius: 8px;
            }
            .skeleton-no-collection {
              display: flex;
              justify-content: center;
              align-items: center;
            
            }
            .skeleton-line {
              width: 200px;
              height: 20px;
              background-color: #e0e0e0;
              border-radius: 4px;
            }
          `}
        </style>
      </div>
    );
  }

  // Основной контент после загрузки
  return (
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
          <p className="no-collection-text">{texts.noCollectionFound}</p>
        )}
      </div>
      <style>
        {`
          .collection-status {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
          }
          .no-collection-text {
            margin-top: 20px;
            font-size: 18px;
            color: #888;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
};

export default CollectionStatus;
