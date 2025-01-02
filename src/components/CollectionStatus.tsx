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

          .collection-status {
  padding-top: 2vh; /* Отступ сверху в 2% от высоты экрана */
  background-color: rgba(245, 215, 44, 0.7); /* Полупрозрачный желтый фон */
  height: auto; /* Высота элемента автоматически подстраивается под содержимое */
  border: 1px solid rgba(245, 215, 44, 0.7); /* Полупрозрачная желтая рамка вокруг элемента */
  border-radius: 25px; /* Скругленные углы для элемента */
  padding: 5px; /* Внутренние отступы внутри элемента */
  margin: 5%; /* Внешние отступы со всех сторон в 5% от ширины родителя */
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2), 
              0 4px 6px rgba(0, 0, 0, 0.1); /* Тени для создания объема */
  transition: box-shadow 0.3s ease-in-out; /* Плавное изменение тени при взаимодействии */
} 
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
  justify-content: center;
  align-items: center;
            }
            .skeleton-status {
              width: 150px;
              padding: 5px;
              margin: 5%;
              height: 6vh;
              background-color: #e0e0e0;
              border-radius: 8px;
              box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2), 
              0 4px 6px rgba(0, 0, 0, 0.1); 
  transition: box-shadow 0.3s ease-in-out; 
  text-align: center;
  justify-content: center;
  align-items: center;
    display: flex;
  flex-direction: column;
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
