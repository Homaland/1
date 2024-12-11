import React from "react"; 
import { TonConnectButton } from "@tonconnect/ui-react";
import { BackButton } from "../components/BackButton";

type SettingsPageProps = {
  language: "RU" | "ENG";
  setLanguage: React.Dispatch<React.SetStateAction<"RU" | "ENG">>;
};

const SettingsPage: React.FC<SettingsPageProps> = ({ language, setLanguage }) => {
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as "RU" | "ENG");
  };

  return (
    <div className="settings-page">
      <BackButton />
      <h2>Settings</h2>

      <label>
        Select Language:
        <select value={language} onChange={handleLanguageChange}>
          <option value="RU">Русский</option>
          <option value="ENG">English</option>
        </select>
      </label>

      <div className="wallet-connection">
        <TonConnectButton />
      </div>
    </div>
  );
};

export default SettingsPage;
