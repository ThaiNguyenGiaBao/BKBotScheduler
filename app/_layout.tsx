// app/_layout.tsx
import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import ChatBotIcon from "@/component/chatbotIcon";
import * as SplashScreen from "expo-splash-screen";
import * as Sentry from "@sentry/react-native";
import "./global.css";
import React from "react";

function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <ChatBotIcon />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default Sentry.wrap(RootLayout);
