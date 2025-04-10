import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";

const signIn = () => {
  
  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={images.onboarding}
          style={{ width: "100%", height: "66%" }}
          resizeMode="contain"
        />

        <View className="flex  items-center h-2/6">
          <Text className="uppercase rounded-bl">welcome to restate</Text>
          <Text className="text-3xl font-rubik-bold rounded-bl">
            Let's get you closer to
          </Text>
          <Text className="text-3xl font-rubik-bold rounded-bl text-primary-300">
            your dream home
          </Text>
          <Text className="text-base font-rubik-regular rounded-bl mt-5">
            Sign in to continue
          </Text>
          <TouchableOpacity className=" shadow-md rounded-3xl bg-white p-3 mt-4 w-5/6 mx-3">
            <View className="flex flex-row items-center justify-center">
              <Image source={icons.google} style={{ width: 20, height: 20 }} />
              <Text className="font-rubik-medium ml-2 text-lg"> 
                Sign in with Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signIn;
