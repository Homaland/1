import { FC, useEffect } from "react";
import WebApp from "@twa-dev/sdk";

interface BackButtonProps {
  onClick?: () => void;  // Updated to clarify the onClick type
}

let isButtonShown = false;

export const BackButton: FC<BackButtonProps> = ({
  onClick = () => {
    window.history.back();
  },
}) => {
  useEffect(() => {
    // Show the back button when the component mounts
    WebApp.BackButton.show();
    isButtonShown = true;

    return () => {
      // Hide the back button when the component unmounts
      isButtonShown = false;
      if (!isButtonShown) {
        WebApp.BackButton.hide();
      }
    };
  }, []); // Empty array ensures this runs only on mount/unmount

  useEffect(() => {
    // Attach event handler for when back button is clicked
    WebApp.onEvent("backButtonClicked", onClick);

    return () => {
      // Clean up event listener when component unmounts
      WebApp.offEvent("backButtonClicked", onClick);
    };
  }, [onClick]); // Re-run when onClick changes

  return null; // This component doesn't render anything
};
