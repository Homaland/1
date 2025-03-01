import React, { useState, useEffect } from "react";

export const SticList: React.FC = () => {
  const [loading, setLoading] = useState(true); // Состояние загрузки

  useEffect(() => {
    // Эмулируем задержку загрузки
    const timer = setTimeout(() => setLoading(false), 2000); // Убираем заглушки через 2 секунды
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    // Skeleton-заглушки
    return (
      <div className="stic-list skeleton-stic-list">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="skeleton-stic-item" />
        ))}
        <style>
          {`
            @keyframes skeleton-loading {
              0% {
                background-color: #e0e0e0;
              }
              50% {
                background-color: #f7f7f7;
              }
              100% {
                background-color: #e0e0e0;
              }
            }

            .skeleton-stic-list {
              display: flex;
              gap: 5px;
              overflow: auto;
            }

            .skeleton-stic-item {
              flex: 0 0 auto;
              width: 20%;
              margin-left: 5%;
              margin-bottom: 5%;
              background-color: rgba(224, 224, 224, 0.87);
              border-radius: 25px;
              height: 90px; /* Высота заглушки */
              animation: skeleton-loading 1.5s infinite ease-in-out;
            }
          `}
        </style>
      </div>
    );
  }

  // Основной контент после загрузки
  return (
    <div className="stic-list">
      <div className="stic-carousel">
        {/* Каждый stic-item содержит одно изображение */}
        <div className="stic-item">
          <img
            className="stic-image"
            src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/IMG_0100.png"
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
  );
};
