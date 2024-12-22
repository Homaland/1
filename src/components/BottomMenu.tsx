import React from "react"; 
import { useNavigate } from "react-router-dom";  // Импорт useNavigate
import { useLocation } from "react-router-dom";  // Импорт useLocation
import { FaHome, FaTasks, FaGamepad, FaStore, FaUsers } from "react-icons/fa";

const BottomMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();  // Создаем объект navigate

  return (
    <div className="bottom-menu">
      <div
        className={`menu-item ${location.pathname === "/" ? "active" : ""}`}
        onClick={() => navigate("/")}  // Используем navigate для перехода
      >
        <FaHome className={location.pathname === "/" ? "active-icon" : ""} />
        <span>Home</span>
      </div>
      <div
        className={`menu-item ${location.pathname === "/task" ? "active" : ""}`}
        onClick={() => navigate("/task")}  // Используем navigate для перехода
      >
        <FaTasks className={location.pathname === "/task" ? "active-icon" : ""} />
        <span>Task</span>
      </div>
      <div
        className={`menu-item ${location.pathname === "/play" ? "active" : ""}`}
        onClick={() => navigate("/play")}  // Используем navigate для перехода
      >
        <FaGamepad className={location.pathname === "/play" ? "active-icon" : ""} />
        <span>Play</span>
      </div>
      <div
        className={`menu-item ${location.pathname === "/shop" ? "active" : ""}`}
        onClick={() => navigate("/shop")}  // Используем navigate для перехода
      >
        <FaStore className={location.pathname === "/shop" ? "active-icon" : ""} />
        <span>Shop</span>
      </div>
      <div
        className={`menu-item ${location.pathname === "/fren" ? "active" : ""}`}
        onClick={() => navigate("/fren")}  // Используем navigate для перехода
      >
        <FaUsers className={location.pathname === "/fren" ? "active-icon" : ""} />
        <span>Fren</span>
      </div>
    </div>
  );
};

export default BottomMenu;
