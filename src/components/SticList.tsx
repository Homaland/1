// src/components/SticList.tsx
import React from "react";

export const SticList: React.FC = () => {
  return (
    <div className="stic-list">
      <div className="stic-carousel">
        {/* Each stic-item contains one image */}
        <div className="stic-item">
          <img
            className="stic-image"
            src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/IMG_0100.png"
            alt="Background"
          />
        </div>
        <div className="stic-item">
          <img
            className="stic-image"
            src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/IMG_0090.png"
            alt="Background"
          />
        </div>
        <div className="stic-item">
          <img
            className="stic-image"
            src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/IMG_0084-ezgif.com-optimize.gif"
            alt="Background"
          />
        </div>
        <div className="stic-item">
          <img
            className="stic-image"
            src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/IMG_0091.png"
            alt="Background"
          />
        </div>
        <div className="stic-item">
          <img
            className="stic-image"
            src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/IMG_0092.png"
            alt="Background"
          />
        </div>
      </div>
    </div>
  );
};
