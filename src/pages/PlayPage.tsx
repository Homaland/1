import React from "react";
import BottomMenu from "../components/BottomMenu";
import "./PlayPage.css";

const TaskPage: React.FC = () => {
  return (
   <div className="play-page"><h1>Play</h1>
      <p>Soon</p>
      <div className="image-container">
        <img
          src="https://raw.githubusercontent.com/HODRLAND/HODR/refs/heads/main/actwin%20.png"
          alt="Background"
        />
      </div>
      <BottomMenu />
    </div>
  );
};

export default TaskPage;
