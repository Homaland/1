export type Language = 'RU' | 'ENG';

const languageStorageKey = "language";

// Function to load the language from localStorage
export const loadLanguage = (): Language => {
  const storedLanguage = localStorage.getItem(languageStorageKey);
  if (storedLanguage === "ru") {
    return "RU";
  } else {
    return "ENG"; // Fallback to 'ENG' if no or incorrect value
  }
};

// Function to save the language to localStorage
export const saveLanguage = (language: Language): void => {
  localStorage.setItem(languageStorageKey, language);
};

// Texts for each language
// Texts для каждого языка
const texts: Record<Language, { 
  connectWallet: string; 
  holderStatus: string; 
  hodrCollectionFound: string; 
  hodrCollectionNotFound: string; 
  noCollectionFound: string; 
  yourNfts: string 
}> = {
  'RU': {
    connectWallet: 'Подключить кошелек',
    holderStatus: 'Статус держателя',
    hodrCollectionFound: 'Коллекция HODR найдена',
    hodrCollectionNotFound: 'Коллекция HODR не найдена',
    noCollectionFound: 'Коллекция не найдена',
    yourNfts: 'Ваши NFT',
  },
  'ENG': {
    connectWallet: 'Connect Wallet',
    holderStatus: 'Holder Status',
    hodrCollectionFound: 'HODR Collection Found',
    hodrCollectionNotFound: 'HODR Collection Not Found',
    noCollectionFound: 'No Collection Found',
    yourNfts: 'Your NFTs',
  },
};

// Функция для получения текстов для конкретного языка
export const getText = (language: Language) => texts[language];

