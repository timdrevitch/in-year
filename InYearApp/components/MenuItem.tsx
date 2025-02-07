import { FontAwesome } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "./Themed";

interface MenuItemProps {
  icon: keyof typeof FontAwesome.glyphMap;
  label: string;
  onPress?: () => void;
  color?: string;
};

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress, color }) => {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <FontAwesome name={icon} size={22} color={color || "#666"} />
      <Text style={[styles.menuText, { color: color || "#333" }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  menuList: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuText: {
    fontSize: 18,
    marginLeft: 15,
  },
});

export default MenuItem;
