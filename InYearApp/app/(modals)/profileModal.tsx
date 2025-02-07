import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { StatusBar } from "expo-status-bar";
import { Image, Platform, StyleSheet } from "react-native";
import useUserData from "../../hooks/useFetchUserData";

// import EditScreenInfo from '@/components/EditScreenInfo';
// import { Text, View } from '@/components/Themed';

export default function ProfileModalScreen() {

  const { userName} = useUserData();

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/shrekBurglar.png")} style={styles.profileImage} />
      <Text style={styles.title}>Hello {userName}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>Welcome to your profile</Text>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 120,
    height: 120, 
    borderRadius: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
