import React from "react";
import { Link } from "react-router-dom";  // Импорт Link
import { useLocation } from "react-router-dom";  // Импорт useLocation
import { FaHome, FaTasks, FaGamepad, FaStore, FaUsers } from "react-icons/fa";

const BottomMenu: React.FC = () => {
  const location = useLocation();

  return (
    <div className="bottom-menu">
      <Link
        to="/"
        className={`menu-item ${location.pathname === "/" ? "active" : ""}`}
      >
        <FaHome className={location.pathname === "/" ? "active-icon" : ""} />
        <span>Home</span>
      </Link>
      <Link
        to="/task"
        className={`menu-item ${location.pathname === "/task" ? "active" : ""}`}
      >
        <FaTasks className={location.pathname === "/task" ? "active-icon" : ""} />
        <span>Task</span>
      </Link>
      <Link
        to="/play"
        className={`menu-item ${location.pathname === "/play" ? "active" : ""}`}
      >
        <FaGamepad className={location.pathname === "/play" ? "active-icon" : ""} />
        <span>Play</span>
      </Link>
      <Link
        to="/shop"
        className={`menu-item ${location.pathname === "/shop" ? "active" : ""}`}
      >
        <FaStore className={location.pathname === "/shop" ? "active-icon" : ""} />
        <span>Shop</span>
      </Link>
      <Link
        to="/fren"
        className={`menu-item ${location.pathname === "/fren" ? "active" : ""}`}
      >
        <FaUsers className={location.pathname === "/fren" ? "active-icon" : ""} />
        <span>Fren</span>
      </Link>
    </div>
  );
};

export default BottomMenu;
