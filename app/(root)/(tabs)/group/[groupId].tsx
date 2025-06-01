// File: app/group/[groupId].tsx

import React, {useState, useEffect} from "react";
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
  StyleSheet
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import images from "@/constants/images";
import TopBar from "@/component/topBar";
import { Group } from "@/types";
import api from "@/api";
import DateTimePicker from "@react-native-community/datetimepicker";

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
  

  const [tasks, setTasks] = useState<Event[]>([
   
  ]);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleEventChange = (field: keyof Event, value: string) => {
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
      const response = await api.post("/events", {
        groupId: groupId,
        description: newEvent.description,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
      });

      console.log("Event created successfully:", response.data);
      setTasks((prev) => [...prev, response.data]);
      setNewEvent({ id: "", description: "", startTime: "", endTime: "" });
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  }

  const onStartChange = (event:Event, selectedDate:any) => {
    // On Android: picker closes after selection; on iOS: keep it open until the user taps “Done”
    setShowStartPicker(Platform.OS === "ios");

    if (selectedDate) {
      const hhmm = formatTime(selectedDate);
      handleEventChange("startTime", hhmm);
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
    }
    fetchTasks();
  }
  , []);

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
          <Text className=" text-gray-600">
            3 tasks remaining
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
            <View>
              <Text className="text-base text-gray-800 flex-1">
                {task.description}
              </Text>
                <Text className="text-sm text-gray-500 ">{formatTime(task.startTime) } to {formatTime(task.endTime)}</Text>
              
            </View>
             

              <TouchableOpacity className="ml-5 p-1">
                <Feather name="trash-2" size={20} color="#E02424" />
              </TouchableOpacity>

            {/* Right: Date/Time */}
          </View>
        ))}

        {/* ─────────────────────── Add New Event Button ─────────────────────── */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="mt-4 mx-8 bg-blue-100 rounded-full py-3 items-center justify-center"
        >
          <Text className="text-blue-900 font-medium text-base" >
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
                className="flex-1 justify-center items-center bg-black/30"
              >
                <View className="bg-white w-11/12 mx-2 rounded-2xl p-5">
                  <View className="flex-row mb-4">
                    <Text className="text-center text-2xl font-rubik-bold flex-1">
                    Create Group
                  </Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Text className="text-xl font-bold text-red-600">&times;</Text>
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
                  <TextInput
                    placeholder="Event Title"
                    value={newEvent.description}
                    onChangeText={(value) => handleEventChange("description", value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
                  />
      
                  {/* Input: Group Description (optional) */}
                  <TextInput
                    placeholder="Start Time"
                    value={newEvent.startTime}
                    onChangeText={(value) => handleEventChange("startTime", value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
                  
                  />

                  <Text style={styles.label}>Start Time</Text>
                <TouchableOpacity
                  style={styles.inputBox}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={styles.inputText}>
                    {newEvent.startTime ? newEvent.startTime : "Select start time"}
                  </Text>
                </TouchableOpacity>
                {true && (
                  <DateTimePicker
                    value={new Date (newEvent.startTime)}
                    mode="time"
                    is24Hour={true}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={() =>{}}
                  />
                )}

                  <TextInput
                    placeholder="End Time"
                    value={newEvent.endTime}
                    onChangeText={(value) => handleEventChange("endTime", value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
                    
                  />
      
                  {/* Save Button */}
                  <TouchableOpacity
                    className="bg-blue-500 rounded-full py-3 items-center"
                    //onPress={handleCreateGroup}
                  >
                    <Text className="text-white font-rubik-medium text-base">
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </Modal>
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