import { App } from "@capacitor/app";

export function registerBackButtonHandler() {
  if (typeof window === "undefined") return;

  App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      App.minimizeApp();
    }
  });
}
