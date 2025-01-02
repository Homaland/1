// pages/EarnPage.tsx
import React from "react";
import BottomMenu from "../components/BottomMenu";

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
