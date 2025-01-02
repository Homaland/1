import { useEffect, useState } from "react";

function TokenInfo() {
  const [tokenData, setTokenData] = useState<{
    name: string;
    price: string;
    change: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await fetch(
          "https://api.dexscreener.com/latest/dex/tokens/EQAd8haI5too0B-KdsIbZ7Fa-pook8wUwT6-Z3SDDD3n13mg"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch token data");
        }
        const data = await response.json();

        const tokenInfo = data.pairs[0];
        setTokenData({
          name: tokenInfo.baseToken.symbol,
          price: `$${tokenInfo.priceUsd}`,
          change: `${tokenInfo.priceChange.h6}%`,
        });
      } catch (err) {
        console.error(err);
        setError("Error fetching token data");
      }
    };

    fetchTokenData();
  }, []);

  return (
    <div className="token-info" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <style>
        {`
          @keyframes skeleton-loading {
            0% {
              background-color: #e0e0e0;
            }
            50% {
              background-color: #f7f7f7;
            }
            100% {
              background-color: #e0e0e0;
            }
          }

          .skeleton-circle {
            width: 40px;
            height: 40px;
            background-color: #e0e0e0;
            border-radius: 50%;
            animation: skeleton-loading 2s infinite;
          }

          .skeleton-line {
            height: 20px;
            background-color: #e0e0e0;
            border-radius: 4px;
            animation: skeleton-loading 2s infinite;
          }
        `}
      </style>
      {error ? (
        <div className="skeleton" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="skeleton-circle"></div>
          <div className="skeleton-line" style={{ width: "100px" }}></div>
          <div className="skeleton-line" style={{ width: "60px" }}></div>
        </div>
      ) : tokenData ? (
        <>
          <img
            src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/HODR.png"
            alt="Token Logo"
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          />
          <span style={{ fontWeight: "bold" }}>{tokenData.price}</span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              color: parseFloat(tokenData.change) > 0 ? "green" : "red",
              gap: "5px",
            }}
          >
            {parseFloat(tokenData.change) > 0 ? "▲" : "▼"}
            {tokenData.change}
          </span>
        </>
      ) : (
        <div className="skeleton" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="skeleton-circle"></div>
          <div className="skeleton-line" style={{ width: "100px" }}></div>
          <div className="skeleton-line" style={{ width: "60px" }}></div>
        </div>
      )}
    </div>
  );
}

export default TokenInfo;
