import { useState } from "react";
import { JettonBalance } from "@ton-api/client";
import { toDecimals } from "../utils/decimals";
import { Address } from "@ton/core";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { getJettonTransaction } from "../utils/jetton-transfer";

interface SendJettonModalProps {
  jetton: JettonBalance;
  senderAddress: Address;
  onClose: () => void;
  jettons: JettonBalance[];
  isVisible: boolean;
}

export const SendJettonModal = ({
  jetton,
  senderAddress,
  onClose,
  jettons,
  isVisible,
}: SendJettonModalProps) => {
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [selectedJetton, setSelectedJetton] = useState<JettonBalance>(jetton);
  const [error, setError] = useState<string | null>(null);
  const [tonConnectUI] = useTonConnectUI();

  // Фильтруем только жетоны с балансом > 0
  const filteredJettons = jettons.filter(
    (jettonItem) => parseFloat(toDecimals(jettonItem.balance, jettonItem.jetton.decimals)) > 0
  );

  const handleSubmit = () => {
    if (!selectedJetton) return;

    try {
      const transaction = getJettonTransaction(
        selectedJetton,
        amount,
        recipientAddress,
        senderAddress
      );

      tonConnectUI
        .sendTransaction(transaction)
        .then(() => {
          setError(null);
          onClose();
        })
        .catch((e) => setError(e.message || "Transaction failed"));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    }
  };

  return (
    <div className={`overlay ${isVisible ? "visible" : ""}`}>
      <div className={`slide-modal ${isVisible ? "visible" : ""}`}>
        <div className="modal-content">
          <h2>Send</h2>
          {error && <p className="error">{error}</p>}

          <label>
            Select:
            <select
              value={selectedJetton.jetton.symbol}
              onChange={(e) => {
                const jettonToSend = filteredJettons.find(
                  (item) => item.jetton.symbol === e.target.value
                );
                if (jettonToSend) setSelectedJetton(jettonToSend);
              }}
            >
              {filteredJettons.map((jettonItem) => (
                <option key={jettonItem.jetton.symbol} value={jettonItem.jetton.symbol}>
                  {jettonItem.jetton.name} ({jettonItem.jetton.symbol})
                </option>
              ))}
            </select>
          </label>

          <label>
            Recipient Address:
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="Enter recipient address"
            />
          </label>

          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Enter amount (up to ${toDecimals(
                selectedJetton.balance,
                selectedJetton.jetton.decimals
              )})`}
            />
          </label>

          <button onClick={handleSubmit}>Send</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
