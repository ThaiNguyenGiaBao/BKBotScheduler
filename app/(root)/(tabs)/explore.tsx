import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import FilterList from "@/component/filterList";
import Search from "@/component/search";
import { SafeAreaView } from "react-native-safe-area-context";
import RecommendationItem from "@/component/recommendationItem";
import images from "@/constants/images";
import icons from "@/constants/icons";

const Explore = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="p-3" showsHorizontalScrollIndicator={false}>
        <View className="flex flex-row justify-between items-center">
          <Image
            source={icons.backArrow}
            style={{ width: 30, height: 30 }}
          ></Image>
          <Text className="font-rubik-bold text-xl">
            Explore your dream home
          </Text>
          <Image
            source={icons.bell}
            style={{ width: 30, height: 30 }}
          ></Image>
        </View>
        <Search />
        <View className="mt-3"></View>
        <FilterList />
        <Text className="font-rubik-bold text-xl mt-5">Found 24 properties</Text>
        <View className="flex flex-row gap-5 mt-5 flex-wrap justify-center">
          <RecommendationItem
            name="Japan Modern"
            price={1000}
            image={images.newYork}
          />
          <RecommendationItem
            name="Japan Modern"
            price={1000}
            image={images.newYork}
          />
          <RecommendationItem
            name="Japan Modern"
            price={1000}
            image={images.newYork}
          />
          <RecommendationItem
            name="Japan Modern"
            price={1000}
            image={images.newYork}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explore;
