import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export async function setStatusBarForTheme(isDark: boolean) {
  if (!Capacitor.isNativePlatform()) return;

  await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
  await StatusBar.setBackgroundColor({
    color: isDark ? "#020617" : "#FFFFFF",
  });
}
