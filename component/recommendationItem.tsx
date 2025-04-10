import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import icons from "@/constants/icons";
import { useRouter } from "expo-router";

const RecommendationItem = ({
  name,
  price,
  image,
}: {
  name: string;
  price: number;
  image: any;
}) => {
  const [liked, setLiked] = useState(false);
  const router = useRouter();

  const handlePress = (id: number) => {
    // Redirect to /properties/:id
    router.push(`/properties/${id}`);
  };
  return (
    <TouchableOpacity
      onPress={() => handlePress(price)}
      className="border border-gray-100 rounded-lg p-2 shadow-md w-[47%] max-w-[190]"
    >
      <Image
        source={image}
        style={{ height: 150, width: "auto" }}
        resizeMode="cover"
        className="rounded-lg"
      ></Image>
      <View className="flex flex-col mt-2">
        <Text className="font-rubik-semibold text-lg">{name}</Text>
        <Text className="font-rubik text-primary-300">${price}</Text>
      </View>
      <TouchableOpacity
        onPress={() => setLiked(!liked)}
        className="flex flex-row items-center absolute mt-2 right-4"
      >
        <Image
          source={icons.heart}
          tintColor={liked ? "#FF0000" : "#666876"}
          style={{ width: 20, height: 20 }}
          resizeMode="contain"
          className=""
        ></Image>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default RecommendationItem;
