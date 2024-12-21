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
      <div className="send-button-container">
        <button
          className="send-button"
          onClick={() => onSendClick(jettons ? jettons[0] : null)} // Используем onSendClick вместо setSelectedJetton
        >
          <span className="material-symbols-outlined">send_money</span>
        </button>
        <p
          className="send-button-text"
          onClick={() => onSendClick(jettons ? jettons[0] : null)} // Обработчик клика
        >
          Send
        </p> {/* Текст под кнопкой */}
      </div>
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
