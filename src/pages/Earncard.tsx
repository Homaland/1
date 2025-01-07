import { useEffect, useState } from "react"; 
import WebApp from '@twa-dev/sdk';

function Earncard() {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (WebApp.initDataUnsafe && WebApp.initDataUnsafe.user) {
      const telegramId = WebApp.initDataUnsafe.user.id;
      console.log("Telegram ID:", telegramId);  // Логируем ID пользователя

      fetch(`https://homaland-hodrland-04a0.twc1.net/get_balance/${telegramId}`) // Используем обратные кавычки
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            setBalance(data.balance);
          } else {
            console.error("Error fetching balance:", data.message);
          }
        })
        .catch((error) => {
          console.error("Error fetching balance:", error);
        });
    }
  }, []);

  return (
    <div className="EarnPage">
      {balance !== null ? (
        <p>Your HODR points: {balance}</p>
       
      ) : (
        <div className="skeleton-loading">
          <div className="skeleton-text" />
        </div>
      )}<p>Claim (soon)</p>
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

      

          .skeleton-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
          }

          .skeleton-text {
            width: 200px;
            height: 20px;
            background-color: #e0e0e0;
            border-radius: 4px;
            animation: skeleton-loading 2s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
}

export default Earncard;
