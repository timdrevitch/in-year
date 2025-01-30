import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useThemeColor } from "../hooks/useThemeColor";
import { StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import "./Value.scss";

type ValueProps = {
  label: string;
  fontAwesomeIcon?: React.ComponentProps<typeof FontAwesome>["name"];
  fontAwesome5Icon?: React.ComponentProps<typeof FontAwesome5>["name"];
  fontAwesome6Icon?: React.ComponentProps<typeof FontAwesome6>["name"];
  ionicon?: React.ComponentProps<typeof Ionicons>["name"];
  value: string;
  change?: string | null;
};

const Value = ({ label, fontAwesomeIcon, fontAwesome5Icon, fontAwesome6Icon, ionicon, value, change }: ValueProps) => {

  // Use the theme colors for text and background
  const backgroundColor = useThemeColor({}, "background");
  const cardBackgroundColor = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "darkerText");
  const titleColor = useThemeColor({}, "text");
  const changeText = useThemeColor({}, "greenText");
  const interactionText = useThemeColor({}, "blueText");

  return (
    <View id="value-component" style={[{ backgroundColor: cardBackgroundColor }]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <View style={[styles.valueContainer, { backgroundColor: cardBackgroundColor }]}>
        {fontAwesomeIcon && (
          <FontAwesome
            name={fontAwesomeIcon}
            size={25}
            color={textColor}
            style={styles.icon}
          />
        )}
        {fontAwesome5Icon && (
          <FontAwesome5
            name={fontAwesome5Icon}
            size={25}
            color={textColor}
            style={styles.icon}
          />
        )}
        {fontAwesome6Icon && (
          <FontAwesome6
            name={fontAwesome6Icon}
            size={25}
            color={textColor}
            style={styles.icon}
          />
        )}
        {ionicon && (
          <Ionicons
            name={ionicon}
            size={25}
            color={textColor}
            style={styles.icon}
          />
        )}
        <Text style={[styles.value, { color: titleColor }]}>{value}</Text>
        {change && <Text style={[styles.changeText, { color: changeText }]}> +{change}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: "white",
    fontSize: 12,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 3,
  },
  value: {
    fontSize: 25,
    fontWeight: "500",
    marginBottom: 5,
  },
  changeText: {
    color: "green",
    fontSize: 16,
    marginLeft: 5,
  },
});

export default Value;