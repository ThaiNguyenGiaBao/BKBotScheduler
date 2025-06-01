// File: app/group/[groupId].tsx

import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {  useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import images from "@/constants/images";
import TopBar from "@/component/topBar";

interface Task {
  id: string;
  title: string;
  datetime: string;
}

export default function GroupDetail() {
  // 1) Read the dynamic groupId from the URL (e.g. /group/42 → { groupId: "42" })
  //const { groupId } = useSearchParams<{ groupId: string }>();
  const groupId = "cnpm"; // hardcoded for demo purposes
  const router = useRouter();

  // 2) In a real app, you would fetch group data based on groupId.
  //    Here we mock up:
  const groupTitle = `CNPM - ${groupId?.toUpperCase()}`;
  const avatarSrc = images.avatar; // placeholder avatar
  const tasks: Task[] = [
    { id: "t1", title: "Tổng kết dự án", datetime: "19/2, 9pm - 10pm" },
    { id: "t2", title: "Họp đầu tuần", datetime: "03/3, 9pm - 10pm" },
  ];
  const remainingTasks = tasks.length;

  return (
    <SafeAreaView className="flex-1 bg-white p-3">
      {/* ─────────────────────────── Header ─────────────────────────── */}
      <TopBar
        title="Group Details"
        showBackButton={true}
        onBackPress={() => router.back()}
        showNotiIcon={false}
      />

      {/* ─────────────────────── Group Header Info ─────────────────────── */}
      <View className="flex-row items-center  py-6">
        {/* Avatar */}
        <Image
          source={avatarSrc}
          className="w-16 h-16 rounded-full mr-4"
          resizeMode="cover"
        />

        {/* Title + Subtitle */}
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">
            {groupTitle}
          </Text>
          <Text className="text-sm text-gray-600">
            {remainingTasks} tasks remaining
          </Text>
        </View>

        {/* Settings icon (no-op) */}
        <TouchableOpacity className="p-2">
          <Ionicons name="settings-outline" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* ─────────────────────── Task List ─────────────────────── */}
      <ScrollView
        className=""
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {tasks.map((task) => (
          <View
            key={task.id}
            className="flex-row items-center justify-between border border-gray-300 rounded-lg px-4 py-3 mb-3"
          >
            {/* Left: Task title + Trash icon */}
            <View className="flex-row items-center flex-1">
              <Text className="text-base text-gray-800 flex-1">
                {task.title}
              </Text>
              <TouchableOpacity className="ml-2 p-1">
                <Feather name="trash-2" size={20} color="#E02424" />
              </TouchableOpacity>
            </View>

            {/* Right: Date/Time */}
            <Text className="text-sm text-gray-500 ml-2">{task.datetime}</Text>
          </View>
        ))}

        {/* ─────────────────────── Add New Event Button ─────────────────────── */}
        <TouchableOpacity
          onPress={() => {
            /* TODO: navigate to “Add Event” screen or open a modal */
          }}
          className="mt-4 mx-8 bg-blue-100 rounded-full py-3 items-center justify-center"
        >
          <Text className="text-blue-900 font-medium text-base">
            Add new event
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
