import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { useRouter } from "expo-router";

const HouseAttribute = ({ att, icon }: { att: string; icon: any }) => {
  return (
    <TouchableOpacity className="  bg-blue-100 rounded-full px-3 py-1 gap-2 flex flex-row items-center">
      <Image source={icon} style={{ width: 20, height: 20 }}></Image>
      <Text className=" font-rubik-semibold text-sm text-gray-700">{att}</Text>
    </TouchableOpacity>
  );
};

const Properies = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="p-3" showsHorizontalScrollIndicator={false}>
        <View className="-m-3">
          {" "}
          {/* Negative margin to counteract padding */}
          <Image
            source={images.japan}
            style={{ width: "100%", height: 300 }}
            resizeMode="cover"
          />
          <TouchableOpacity
            className="absolute top-3 left-3"
            onPress={() => {
              // Redirect to /properties/:id
              router.back();
            }}
          >
            <Image
              source={icons.backArrow}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            ></Image>
          </TouchableOpacity>
        </View>
        <View className="flex flex-row justify-between items-center mt-3">
          <Text className="font-rubik-bold text-2xl mt-3">Japan Modern</Text>
          <Text className="font-rubik-semibold text-xl mt-3 text-primary-300">
            $1000
          </Text>
        </View>
        {/* attribute */}{" "}
        <View className="flex flex-row items-center mt-3 gap-5">
          <HouseAttribute att="3 Bed" icon={icons.bed} />
          <HouseAttribute att="2 Bath" icon={icons.bath} />
          <HouseAttribute att="2000 sqrt" icon={icons.area} />
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: "#E0E0E0",
            marginVertical: 20,
          }}
        />
        <Text className="font-rubik-bold text-xl">Agent</Text>
        <View className="flex justify-between flex-row mt-2">
          <View className="flex flex-row items-center gap-2">
            <Image
              source={images.avatar}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
            ></Image>
            <View>
              <Text className="font-rubik-semibold text-sm">John Doe</Text>
              <Text className="font-rubik text-sm text-gray-600">Owner</Text>
            </View>
          </View>
          <Image
            source={icons.phone}
            style={{ width: 30, height: 30 }}
            resizeMode="contain"
          ></Image>
        </View>
        <Text className="font-rubik-bold text-xl mt-6">Decription</Text>
        <Text className="font-rubik text-sm mt-2 text-gray-600">
          This is a beautiful house located in the heart of Japan. It is
          surrounded by beautiful scenery and is perfect for a family of 4.
        </Text>
        <Text className="font-rubik-bold text-xl mt-6">Gallery</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-2"
        >
          <View className="flex flex-row gap-3">
            <Image
              source={images.japan}
              style={{ width: 100, height: 100, borderRadius: 10 }}
              resizeMode="cover"
            />
            <Image
              source={images.japan}
              style={{ width: 100, height: 100, borderRadius: 10 }}
              resizeMode="cover"
            />
            <Image
              source={images.japan}
              style={{ width: 100, height: 100, borderRadius: 10 }}
              resizeMode="cover"
            />
            <Image
              source={images.japan}
              style={{ width: 100, height: 100, borderRadius: 10 }}
              resizeMode="cover"
            />
          </View>
        </ScrollView>
        <Text className="font-rubik-bold text-xl mt-6">Location</Text>
        <View className="flex flex-row items-center mt-2 gap-1">
          <Image
            source={icons.location}
            style={{ width: 20, height: 20 }}
          ></Image>
          <Text className="font-rubik text-sm  text-gray-600">
            123, Main Street, Tokyo, Japan
          </Text>
        </View>
        <Image
          source={images.map}
          style={{ width: "100%", height: 200, borderRadius: 10 }}
          resizeMode="cover"
          className="mt-3"
        />
        <View
          style={{
            height: 1,
            backgroundColor: "#E0E0E0",
            marginVertical: 20,
          }}
        />
        <TouchableOpacity className="bg-primary-300 rounded-full p-3 flex flex-row justify-center items-cente">
          <Text className="font-rubik-semibold text-white">Book Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Properies;
