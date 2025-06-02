// File: app/group/[groupId].tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import images from "@/constants/images";
import TopBar from "@/component/topBar";
import { Group } from "@/types";
import api from "@/api";
import EventItem from "@/component/EventItem";
import DatePicker from "@/component/dateTimePicker";

interface Event {
  id: string;
  description: string;
  startTime: string;
  endTime: string;
}

export default function GroupDetail() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);

  const [group, setGroup] = useState<Group>({
    id: "1",
    name: "CNPM",
    numMember: 3,
    description: "Group for CNPM course discussions",
  });

  const [newEvent, setNewEvent] = useState<Event>({
    id: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  // 2) In a real app, you would fetch group data based on groupId.
  //    Here we mock up:
  const avatarSrc = images.avatar; // placeholder avatar

  const [tasks, setTasks] = useState<Event[]>([]);


  const handleEventChange = (field: keyof Event, value: string) => {
    console.log(`Updating ${field} to:`, value);
    setNewEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  function formatTime(date: string): string {
    //console.log("Formatting date:", date);
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const mins = dateObj.getMinutes().toString().padStart(2, "0");

    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    return `${hours}:${mins} ${day}/${month}`;
  }

  const handleAddEvent = async () => {
    if (!newEvent.description || !newEvent.startTime || !newEvent.endTime) {
      console.log("Please fill in all fields.");
      return;
    }

    try {
      const payload = {
        group_id: groupId,
        description: newEvent.description,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        isRecurring: false,
        isComplete: false,
        type: "EVENT",
        priority: 1,
        summary: "GROUP_EVENT",
      };
      console.log("Creating event with payload:", payload);
      const response = await api.post("events/group", payload); // Adjust endpoint as needed

      console.log("Event created successfully:", response.data);
      setTasks((prev) => [...prev, response.data]);
      setNewEvent({ id: "", description: "", startTime: "", endTime: "" });
      setModalVisible(false);
    } catch (error : any) {
      console.error("Failed to create event:", error);
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/groups/" + groupId); // Adjust endpoint as needed
        setGroup(response.data);
        console.log("Fetched group:", response.data);
      } catch (error) {
        console.log("Failed to fetch group:", error);
      }
    };

    fetchGroups();

    // Fetch tasks for the group
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/events/group/${groupId}`); // Adjust endpoint as needed
        setTasks(response.data.events || []);
        console.log("Fetched tasks:", response.data.events);
      } catch (error) {
        console.log("Failed to fetch tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <ScrollView
        className="p-3"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* ─────────────────────────── Header ─────────────────────────── */}
        <TopBar
          title="Group Details"
          showBackButton={true}
          onBackPress={() => router.back()}
          showNotiIcon={false}
        />

        {/* ─────────────────────── Group Header Info ─────────────────────── */}
        <View className="flex-row items-center  py-6" style={{ padding: 10 }}>
          {/* Avatar */}
          <Image
            source={avatarSrc}
            className="w-12 h-12 rounded-full mr-4"
            resizeMode="cover"
          />

          {/* Title + Subtitle */}
          <View className="flex-1 gap-1">
            <Text className="text-xl font-semibold text-gray-900">
              {group.name || "Group Name"}
            </Text>
            <Text className=" text-gray-600">
              {group.description || "Group description goes here."}
            </Text>
            <Text className=" text-gray-600">3 tasks remaining</Text>
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
            <EventItem
              key={task.id}
              task={task}
              formatTime={formatTime}
              setTasks={setTasks}
            />
          ))}

          {/* ─────────────────────── Add New Event Button ─────────────────────── */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="mt-4 mx-8 bg-blue-100 rounded-full py-3 items-center justify-center"
          >
            <Text className="text-blue-900 font-medium text-base">
              Add new event
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          transparent
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-center items-center bg-black/30 "
          >
            <View className="bg-white w-11/12 mx-2 rounded-2xl p-5">
              <View className="flex-row mb-4">
                <Text className="text-center text-2xl font-rubik-bold flex-1">
                  Create Event
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text className="text-xl font-bold text-red-600">
                    &times;
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Title */}

              {/* Placeholder image (replace with your own or let user upload) */}
              <View className="items-center mb-4">
                <Image
                  resizeMode="contain"
                  source={images.onboarding2 /* your illustration asset */}
                  style={{ width: 300, height: 250 }}
                />
              </View>

              {/* Input: Group Name */}
              <View className="flex-row items-center  bg-white mt-2 gap-2">
                <Text className="font-rubik text-xl my-auto">Title</Text>
                <TextInput
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mb-3"
                  placeholder="Event Title"
                  value={newEvent.description}
                  onChangeText={(value) =>
                    handleEventChange("description", value)
                  }
                />
              </View>

              <DatePicker
                handleEventChange={handleEventChange}
                event="startTime"
                time={newEvent.startTime}
              />
              <DatePicker
                handleEventChange={handleEventChange}
                event="endTime"
                time={newEvent.endTime}
              />

              {/* Save Button */}
              <TouchableOpacity
                className="bg-blue-500 rounded-full py-3 items-center mt-3"
                onPress={handleAddEvent}
              >
                <Text className="text-white font-rubik-medium text-base">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
});
