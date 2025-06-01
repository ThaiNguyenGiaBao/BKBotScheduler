// Explore.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GroupItem from "@/component/groupitem"; // your own component
import images from "@/constants/images"; // your own asset map
import FilterList from "@/component/filterList"; // your own filter component
import TopBar from "@/component/topBar";

import api from "@/api";
import { Group } from "@/types";



const Explore: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "1",
      name: "CNPM",
      numMember: 3,
      description: "Group for CNPM course discussions",
    },
    {
      id: "2",
      name: "AI Enthusiasts",
      numMember: 5,
      description: "Discussing the latest in AI technology",
    },
    {
      id: "3",
      name: "Web Development",
      numMember: 4,
      description: "Sharing web dev tips and resources",
    },
  ]);


  const [modalVisible, setModalVisible] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleCreateGroup = () => {
    // Simple validation: must have at least a title
    if (newTitle.trim().length === 0) {
      // You can show an Alert or set an error message, etc.
      return;
    }

    // Create a new group object
    const newGroup: Group = {
      id: Date.now().toString(), 
      name: newTitle.trim(),
      numMember: 1, 
      description: newDescription.trim() || "", // optional description
    };

    // Call your API to create the group
    api.post("/groups", newGroup)
      .then((response) => {
        console.log("Group created successfully:", response.data);
      }
      )
      .catch((error) => {
        console.error("Failed to create group:", error);
      }
    );

    // Add to the front (or end) of array
    setGroups((prev) => [newGroup, ...prev]);

    // Reset inputs & close modal
    setNewTitle("");
    setNewDescription("");
    setModalVisible(false);
  };

  // fetch groups from API on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/groups"); // Adjust endpoint as needed
        setGroups(response.data.groups || []);
        console.log("Fetched groups:", response.data);
      } catch (error) {
        console.log("Failed to fetch groups:", error);
      }
    };

    fetchGroups();
  }
  , []);

  return (
    <SafeAreaView className="bg-white flex-1">
      <TopBar
          title="Group"
          />

      <ScrollView
        className="p-3"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* ───────────────────────────────── Header ───────────────────────────────── */}
        

        

        <View className="mt-3" />

        <FilterList />

        <View className="mt-5 space-y-3">
          {groups.map((g) => (
            <GroupItem
              key={g.id}
              groupId={g.id}
              title={g.name}
              members={g.numMember}
              description={g.description}
              imageSrc={images.onboarding3}
            />
          ))}
        </View>

        <View className="mt-5 items-center">
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-full w-14 h-14 items-center justify-center"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white text-3xl">+</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ───────────────────────────────── Create Group Modal ───────────────────────────────── */}
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
              placeholder="Group Name"
              value={newTitle}
              onChangeText={setNewTitle}
              className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
            />

            {/* Input: Group Description (optional) */}
            <TextInput
              placeholder="Description"
              value={newDescription}
              onChangeText={setNewDescription}
              className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
              multiline
              numberOfLines={2}
            />

            {/* Save Button */}
            <TouchableOpacity
              className="bg-blue-500 rounded-full py-3 items-center"
              onPress={handleCreateGroup}
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
};

export default Explore;
