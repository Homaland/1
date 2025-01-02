// pages/EarnPage.tsx
import { useEffect, useState } from "react"; 

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
        <p>Your points: {balance}</p>
      ) : (
        <p>Loading your points...</p>
      )}
 </div>
  );


export default EarnPage;
