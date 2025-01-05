import React from "react";
import { BackButton } from "../components/BackButton";
import { JettonList } from "../components/JettonList";

interface JettonDetailsPageProps {
  jettons: any[] | null; // Обновите тип в зависимости от вашего кода
  connectedAddressString: string | null;
  onSendClick: (jetton: any) => void;
}

const JettonDetailsPage: React.FC<JettonDetailsPageProps> = ({
  jettons,
  connectedAddressString,
  onSendClick,
}) => {
  return (
    <div className="jetton-details-page">
      <BackButton />
      <h1>Jetton Details</h1>
      <JettonList
        className="card"
        jettons={jettons}
        connectedAddressString={connectedAddressString}
        onSendClick={onSendClick}
      />
    </div>
  );
};

export default JettonDetailsPage;
