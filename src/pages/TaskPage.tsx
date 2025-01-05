import React, { useEffect, useRef } from "react";
import BottomMenu from "../components/BottomMenu";
import { THEME, TonConnectUI } from "@tonconnect/ui";
import { createSwapWidget } from "@swap-coffee/ui-sdk";

const TaskPage: React.FC = () => {
  const manifestUrl = "https://swap.coffee/tonconnect-manifest.json";
  const widgetInitialized = useRef(false);

  const tonConnectSettings = {
    manifestUrl: manifestUrl,
    uiPreferences: {
      theme: THEME.DARK,
    },
  };

  useEffect(() => {
    if (!widgetInitialized.current) {
      const tonConnectUiInstance = new TonConnectUI(tonConnectSettings);

      createSwapWidget("#swap-widget-component", {
        theme: "light",
        locale: "ru",
        tonConnectManifest: {
          url: manifestUrl,
        },
        injectionMode: "tonConnect",
        tonConnectUi: tonConnectUiInstance,
      });

      widgetInitialized.current = true;
    }
  }, []);

  return (
    <div className="task-page">
      <h1>Task</h1>
      <p>Soon</p>

      <div id="swap-widget-component"></div>
      <BottomMenu />
    </div>
  );
};

export default TaskPage;
