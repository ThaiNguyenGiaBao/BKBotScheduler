import { View, Text } from "react-native";
import React from "react";
import { Image, TextInput } from "react-native";
import icons from "@/constants/icons";

const Search = () => {
  return (
    <View className="flex flex-row items-center mt-4 bg-gray-100 p-2 rounded-lg">
      <Image
        source={icons.search}
        style={{ width: 20, height: 20 }}
        resizeMode="contain"
      ></Image>

      <TextInput
        className="font-rubik  text-gray-400 ml-2  w-full"
        placeholder="Search your dream home"
      ></TextInput>
    </View>
  );
};

export default Search;
