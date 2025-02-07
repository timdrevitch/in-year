import { useState, useEffect } from "react";
import { Appearance, useColorScheme as _useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeType = "system" | "light" | "dark";

export function useCustomColorScheme() {
  const systemColorScheme = _useColorScheme(); // System theme: "light" or "dark"
  const [theme, setTheme] = useState<ThemeType>("system");

  // Load saved theme preference from storage
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme as ThemeType);
      }
    };
    loadTheme();
  }, []);

  // Apply the theme (system, dark, or light)
  useEffect(() => {
    if (theme === "system") {
      Appearance.setColorScheme(systemColorScheme);
    } else {
      Appearance.setColorScheme(theme);
    }
  }, [theme, systemColorScheme]);

  // Function to update the theme and save it
  const updateTheme = async (newTheme: ThemeType) => {
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  return { theme, setTheme: updateTheme };
}