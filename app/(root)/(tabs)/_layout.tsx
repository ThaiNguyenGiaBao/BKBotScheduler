import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import icons from "@/constants/icons";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: any;
  title: string;
}) => {
  return (
    <View className="flex flex-col mt-8 items-center justify-center">
      <Image
        source={icon}
        resizeMode="contain"
        style={{ width: 30, height: 30 }}
        tintColor={focused ? "#0061ff" : "#666876"}
      />
      <Text
        className={`font-rubik-semibold ${
          focused ? "text-primary-300 font-rubik-bold" : "text-black-200"
        }`}
      >
        {title}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { minHeight: 70, backgroundColor: "white" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Explore" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title={"Profile"} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
