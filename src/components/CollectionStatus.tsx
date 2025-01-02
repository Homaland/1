import React, { useState, useEffect } from 'react';

interface CollectionStatusProps {
  hasHODRCollection: boolean | null;
  texts: any;
}

const CollectionStatus: React.FC<CollectionStatusProps> = ({ hasHODRCollection, texts }) => {
  const [loading, setLoading] = useState(true); // Состояние загрузки

  useEffect(() => {
    // Эмулируем задержку загрузки
    const timer = setTimeout(() => setLoading(false), 1000); // Убираем заглушки через 1 секунду
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    // Заглушки
    return (
      <div className="collection-status skeleton-collection-status">
        <div className="cstatus">
          <h3 className="skeleton-text" />
          <div className="skeleton-status" />
        </div>
        <style>
          {`

         
            .skeleton-collection-status {
              padding: 0px;
            }
            .skeleton-text {
              width: 150px;
              height: 20px;
              background-color: #e0e0e0;
              margin-bottom: 10px;
              border-radius: 8px;
               text-align: center;

            }
            .skeleton-status {
              width: 150px;
              padding: 5%;
              
              height: 6vh;
              background-color: #e0e0e0;
             border-radius: 8px;
             text-align: center;

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
          <p>{texts.noCollectionFound}</p>
        )}
      </div>
    </div>
  );
};

export default CollectionStatus;
