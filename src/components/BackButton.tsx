import { FC, useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  onClick?: () => void;
}

let isButtonShown = false;

export const BackButton: FC<BackButtonProps> = ({
  onClick = () => {},
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Показать кнопку назад, когда компонент монтируется
    WebApp.BackButton.show();
    isButtonShown = true;

    return () => {
      // Скрыть кнопку назад, когда компонент размонтируется
      isButtonShown = false;
      if (!isButtonShown) {
        WebApp.BackButton.hide();
      }
    };
  }, []); // Пустой массив зависимостей

  useEffect(() => {
    // Прикрепить обработчик события для кнопки назад
    WebApp.onEvent("backButtonClicked", () => {
      onClick();
      navigate("/");  // Переход на главную страницу
    });

    return () => {
      // Удалить обработчик при размонтировании компонента
      WebApp.offEvent("backButtonClicked", onClick);
    };
  }, [onClick, navigate]); // Переходить только когда onClick или navigate изменяются

  return null; // Этот компонент ничего не рендерит
};
