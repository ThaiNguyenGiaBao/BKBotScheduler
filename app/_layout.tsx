import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import ChatBotIcon from "@/component/chatbotIcon";
import * as SplashScreen from "expo-splash-screen";
import * as Sentry from "@sentry/react-native";
import "./global.css";
import React from "react";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import SignInScreen from "./sign-in"; // Assuming you'll create this file

// Sentry initialization (unchanged)
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  sendDefaultPii: true,
});

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
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <SignedIn>
        <>
          <ChatBotIcon />
          <Stack screenOptions={{ headerShown: false }} />
        </>
      </SignedIn>
      <SignedOut>
        <SignInScreen />
      </SignedOut>
    </ClerkProvider>
  );
}

export default Sentry.wrap(RootLayout);