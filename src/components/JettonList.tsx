import { JettonBalance } from "@ton-api/client";
import { JettonItem } from "./JettonItem";

interface JettonListProps {
  jettons: JettonBalance[] | null;
  connectedAddressString: string | null;
  onSendClick: (jetton: JettonBalance) => void;
  className?: string;
}

export const JettonList = ({ jettons, connectedAddressString, onSendClick, className }: JettonListProps) => {
  return (
    <div className={className}>
      {connectedAddressString ? (
        <div>
          {jettons && jettons.length ? (
            jettons
              .filter((jettonBalance) => jettonBalance.balance > 0) // Filter out jettons with balance 0
              .map((jettonBalance) => (
                <JettonItem key={jettonBalance.jetton.address.toString()} jettonBalance={jettonBalance} onSendClick={onSendClick} />
              ))
          ) : (
            <p>No jettons found</p>
          )}
        </div>
      ) : (
        <p>Connect to see jettons</p>
      )}
    </div>
  );
};
