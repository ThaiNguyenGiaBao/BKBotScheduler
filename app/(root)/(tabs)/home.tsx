import icons from "@/constants/icons";
import images from "@/constants/images";
import { Link } from "expo-router";
import {
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import Search from "@/component/search";
import FilterList from "@/component/filterList";
import RecommendationItem from "@/component/recommendationItem";
import { useRouter } from "expo-router";

const FeatureItem = ({
  name,
  price,
  image,
}: {
  name: string;
  price: number;
  image: any;
}) => {
  const router = useRouter();

  const handlePress = (id: number) => {
    // Redirect to /properties/:id
    router.push(`/properties/${id}`);
  };
  return (
    <TouchableOpacity
      className="flex flex-col items-center"
      onPress={() => handlePress(price)}
    >
      <Image
        source={image}
        style={{ width: 180, height: 220 }}
        resizeMode="cover"
        className="rounded-lg"
      ></Image>
      <Image
        source={images.cardGradient}
        className="absolute rounded-lg"
        style={{ width: 180, height: 220 }}
      ></Image>
      <View className="absolute bottom-2 left-2">
        <Text className="font-rubik-semibold text-lg mt-2  text-white">
          {name}
        </Text>
        <Text className="font-rubik  text-white">${price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const SeeAllButton = () => {
  return (
    <TouchableOpacity className="font-rubik-semibold text-primary-300 text">
      See all
    </TouchableOpacity>
  );
};

export default function Index() {
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="p-3" showsHorizontalScrollIndicator={false}>
        <View className="flex justify-between flex-row">
          <View className="flex flex-row items-center gap-2">
            <Image
              source={images.avatar}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            ></Image>
            <View>
              <Text className="font-rubik text-sm">Hi,</Text>
              <Text className="font-rubik-semibold text-sm">John Doe</Text>
            </View>
          </View>
          <Image
            source={icons.bell}
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
          ></Image>
        </View>
        {/* Search */}
        <Search />

        {/* Features */}
        <View className="flex justify-between flex-row mt-5 items-center">
          <Text className="font-rubik-bold text-xl">Features</Text>
          <SeeAllButton />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-5"
        >
          <View className="flex flex-row gap-5 ">
            <FeatureItem
              name="Japan Modern"
              price={1000}
              image={images.japan}
            ></FeatureItem>
            <FeatureItem
              name="Japan Modern"
              price={1000}
              image={images.japan}
            ></FeatureItem>
            <FeatureItem
              name="Japan Modern"
              price={1000}
              image={images.japan}
            ></FeatureItem>
          </View>
        </ScrollView>

        {/* Our Recommendations */}
        <View className="flex justify-between flex-row mt-5 items-center">
          <Text className="font-rubik-bold text-xl">Our Recommendations</Text>
          <SeeAllButton />
        </View>
        {/* Filter */}
        <FilterList />

        {/* Recommendations */}
        <View className="flex flex-row gap-5 mt-5 flex-wrap justify-center">
          <RecommendationItem
            name="America Villa"
            price={1200}
            image={images.newYork}
          />
          <RecommendationItem
            name="America Villa"
            price={1200}
            image={images.newYork}
          />
          <RecommendationItem
            name="America Villa"
            price={1200}
            image={images.newYork}
          />
          <RecommendationItem
            name="America Villa"
            price={1200}
            image={images.newYork}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
