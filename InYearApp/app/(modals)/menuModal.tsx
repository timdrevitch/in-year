import { Text, useThemeColor, View } from "../../components/Themed";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Pressable, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import MenuItem from "../../components/MenuItem";

export default function MenuModalScreen() {
  const router = useRouter();

  // Theme Colors
  const backgroundColor = useThemeColor({}, "background");
  const cardBackgroundColor = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "darkerText");
  const titleColor = useThemeColor({}, "text");
  const interactionText = useThemeColor({}, "blueText");
  const redText = useThemeColor({}, "redText");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* <Pressable style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="chevron-left" size={22} color={titleColor} />
        <Text style={[styles.backText, { color: titleColor }]}>Back</Text>
      </Pressable>
      <Text style={[styles.title, { color: titleColor }]}>Menu</Text> */}
      <ScrollView style={styles.menuList}>
        <MenuItem
          icon="cog"
          label="Settings"
          color={titleColor}
          //onPress={() => router.push("/settings")}
        />
        <MenuItem
          icon="paint-brush"
          label="Theme"
          color={titleColor}
          onPress={() => router.push("./theme")}
        />
        <MenuItem
          icon="link"
          label="Connected Apps"
          color={titleColor}
          //onPress={() => router.push("/connected-apps")}
        />
        <MenuItem
          icon="bell"
          label="Notifications"
          color={titleColor}
          //onPress={() => router.push("/notifications")}
        />
        <MenuItem
          icon="sign-out"
          label="Logout"
          color={redText}
          //onPress={() => console.log("Logging out...")}
        />
      </ScrollView>

      {/* Status Bar for iOS */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    marginLeft: 10,
  },
});