import React from "react";  
import { useNavigate } from "react-router-dom";  // Импорт useNavigate
import { useLocation } from "react-router-dom";  // Импорт useLocation
import { FaHome, FaTasks, FaMoneyBill, FaStore, FaExchangeAlt } from "react-icons/fa"; // Импорт новой иконки

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
        <FaMoneyBill className={location.pathname === "/play" ? "active-icon" : ""} />
        <span>Earn</span>
      </div>
      <div
        className={`menu-item ${location.pathname === "/shop" ? "active" : ""}`}
        onClick={() => navigate("/shop")}  // Используем navigate для перехода
      >
        <FaStore className={location.pathname === "/shop" ? "active-icon" : ""} />
        <span>Shop</span>
      </div>
      <div
        className={`menu-item ${location.pathname === "/trade" ? "active" : ""}`}
        onClick={() => navigate("/trade")}  // Используем navigate для перехода
      >
        <FaExchangeAlt className={location.pathname === "/trade" ? "active-icon" : ""} />
        <span>Trade</span>
      </div>
    </div>
  );
};

export default BottomMenu;
