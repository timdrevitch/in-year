import { FontAwesome } from "@expo/vector-icons";
import { useThemeColor } from "../hooks/useThemeColor";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "./Themed";

type ThemeType = "system" | "dark" | "light";

interface OptionButtonProps {
  label: string;
  value: ThemeType;
  selected: ThemeType;
  onPress: (theme: ThemeType) => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({ label, value, selected, onPress }) => {
  // Theme Colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackgroundColor = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "darkerText");
  const titleColor = useThemeColor({}, "text");
  const interactionText = useThemeColor({}, "blueText");
  const redText = useThemeColor({}, "redText");

  return (
    <Pressable style={styles.option} onPress={() => onPress(value)}>
      <FontAwesome
        name={selected === value ? "dot-circle-o" : "circle-o"}
        size={20}
        color={selected === value ? "#007AFF" : "#666"}
      />
      <Text style={styles.optionText}>{label}</Text>
    </Pressable>
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

export default OptionButton;