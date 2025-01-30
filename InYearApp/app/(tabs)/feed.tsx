import { Text, View } from "../../components/Themed";
import "./feed.scss";
import EditScreenInfo from "../../components/EditScreenInfo";

type FeedScreenProps = {};

const FeedScreen: React.FC<FeedScreenProps> = () => {
  return (
    <View id="tab-two-page" className="container">
      <Text className="title">Feed</Text>
      <View
        className="separator"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/tabTwo.tsx" />
    </View>
  );
};

export default FeedScreen;
