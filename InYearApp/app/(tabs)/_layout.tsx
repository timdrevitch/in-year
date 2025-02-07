import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Image, Pressable } from "react-native";
import { useColorScheme } from "../../components/useColorScheme";
import Colors from "../../constants/Colors";
import { useClientOnlyValue } from "../../components/useClientOnlyValue";
import { useCustomColorScheme } from "../../components/useCustomColorScheme";

// import Colors from "@/constants/Colors";
// import { useColorScheme } from "@/components/useColorScheme";
// import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {theme} = useCustomColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerLeft: () => (
            <Link href="../profileModal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Image
                    source={require("../../assets/images/shrekBurglar.png")}
                    style={{
                      width: 35, 
                      height: 35, 
                      borderRadius: 17.5,
                      marginLeft: 15,
                      opacity: pressed ? 0.5 : 1, 
                    }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          headerRight: () => (
            <Link href="../menuModal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="bars"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => <TabBarIcon name="feed" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tabThree"
        options={{
          title: "Friends",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="users" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tabFour"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tabFive"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
