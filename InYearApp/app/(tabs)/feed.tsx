import { Text, useThemeColor, View } from "../../components/Themed";
import { StyleSheet } from "react-native";

type FeedScreenProps = {};

const FeedScreen: React.FC<FeedScreenProps> = () => {

  // Use the theme colors for text and background
  const backgroundColor = useThemeColor({}, "background");
  const cardBackgroundColor = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "darkerText");
  const titleColor = useThemeColor({}, "text");
  const changeText = useThemeColor({}, "greenText");
  const interactionText = useThemeColor({}, "blueText");

  return (
    <View id="tab-two-page" className="container">
      <Text style={[styles.title, { color: titleColor }]}>Feed Page</Text>
      {/* <View
        className="separator"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/tabTwo.tsx" /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    marginTop: 30,
    marginBottom: 30,
    height: 1,
    width: "80%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    margin: "auto",
    marginTop: 30
  },
});

export default FeedScreen;
