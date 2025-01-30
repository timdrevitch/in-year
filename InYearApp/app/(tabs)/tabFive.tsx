// import EditScreenInfo from "@/components/EditScreenInfo";
// import { Text, View } from "@/components/Themed";
import EditScreenInfo from "../../components/EditScreenInfo";
import "./tabFive.scss";
import { Text, View } from "../../components/Themed";

type TabFiveScreenProps = {};

const TabFiveScreen: React.FC<TabFiveScreenProps> = () => {
  return (
    <View id="tab-five-page" className="container">
      <Text className="title">Tab Five</Text>
      <View
        className="separator"
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/tabFive.tsx" />
    </View>
  );
};

export default TabFiveScreen;
