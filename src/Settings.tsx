// Settings.tsx
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Settings = ({ setLanguage }: { setLanguage: (lang: string) => void }) => {
  const [language, setLanguageState] = useState<string>('RU');
  const history = useHistory();

  const handleLanguageChange = (lang: string) => {
    setLanguageState(lang);
    setLanguage(lang);
  };

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <h3>Choose Language</h3>
        <button onClick={() => handleLanguageChange('RU')}>Русский</button>
        <button onClick={() => handleLanguageChange('ENG')}>English</button>
      </div>
      <button onClick={() => history.push('/')}>Go Back</button>
    </div>
  );
};

export default Settings;
