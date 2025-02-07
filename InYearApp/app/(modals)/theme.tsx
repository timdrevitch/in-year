import { View, Text, Pressable, StyleSheet } from "react-native";
import { useColorScheme } from "../../components/useColorScheme"; // Use your existing hook
import { FontAwesome } from "@expo/vector-icons";
import OptionButton from "../../components/OptionButton";
import { useState } from "react";
import { useThemeColor } from "../../components/Themed";
import { useCustomColorScheme } from "../../components/useCustomColorScheme";

export default function ThemeScreen() {
  const systemTheme = useColorScheme(); // Get system theme ("light" or "dark")
  const [selectedTheme, setSelectedTheme] = useState<"system" | "dark" | "light">("system");
  const { theme, setTheme } = useCustomColorScheme();
  // Theme Colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackgroundColor = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "darkerText");
  const titleColor = useThemeColor({}, "text");
  const interactionText = useThemeColor({}, "blueText");
  const redText = useThemeColor({}, "redText");

  // const handleThemeChange = (newTheme: "system" | "dark" | "light") => {
  //   setSelectedTheme(newTheme);
  //   // TODO: Apply theme change globally (if needed)
  // };

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      <Text style={[styles.title, {color: titleColor}]}>Enable Dark Mode</Text>

      <OptionButton label="Use System Default" value="system" selected={theme} onPress={setTheme} />
      <OptionButton label="Dark Mode" value="dark" selected={theme} onPress={setTheme} />
      <OptionButton label="Light Mode" value="light" selected={theme} onPress={setTheme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 18,
    marginLeft: 10,
  },
});