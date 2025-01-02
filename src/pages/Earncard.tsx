// pages/EarnPage.tsx
import React from "react";
import BottomMenu from "../components/BottomMenu";

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

const EarnPage: React.FC = () => {
  return (
  
      {balance !== null ? (
        <p>Your points: {balance}</p>
      ) : (
        <p>Loading your points...</p>
      )}

  );
};

export default EarnPage;
