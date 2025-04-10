import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/constants/icons";
import images from "@/constants/images";

const ProfileItem = ({ icon, title }: { icon: any; title: string }) => {
  return (
    <View className="flex flex-col">
      <TouchableOpacity className="flex flex-row justify-between items-center">
        <Text className="font-rubik-semibold text-lg flex flex-row items-center gap-3">
          <Image source={icon} style={{ width: 20, height: 20 }}></Image>
          {title}
        </Text>
        <Image
          source={icons.rightArrow}
          style={{ width: 20, height: 20 }}
        ></Image>
      </TouchableOpacity>
    </View>
  );
};

const Profile = () => {
  return (
    <SafeAreaView>
      <ScrollView className="h-screen p-3 bg-white">
        <View>
          <View className="flex flex-row justify-between items-center">
            <Text className="font-rubik-semibold text-xl">Profile</Text>
            <Image
              source={icons.bell}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            ></Image>
          </View>
        </View>
        <View className="flex flex-col items-center mt-7">
          <Image
            source={images.avatar}
            style={{ width: 150, height: 150 }}
          ></Image>
          <Text className="font-rubik-semibold text-xl mt-2">John Doe</Text>
        </View>

        <View className="flex flex-col mt-7 gap-5">
          <ProfileItem icon={icons.calendar} title="My Bookings" />
          <ProfileItem icon={icons.carPark} title="Payments" />
          <View
            style={{ height: 1, backgroundColor: "#E0E0E0", marginVertical: 8 }}
          />

          <ProfileItem icon={icons.person} title="Profile" />
          <ProfileItem icon={icons.bell} title="Notifications" />
          <ProfileItem icon={icons.shield} title="Security" />
          <ProfileItem icon={icons.language} title="Language" />
          <ProfileItem icon={icons.wallet} title="Currency" />
          <View
            style={{ height: 1, backgroundColor: "#E0E0E0", marginVertical: 8 }}
          />
          <ProfileItem icon={icons.logout} title="Logout" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
