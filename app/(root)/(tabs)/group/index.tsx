// Explore.tsx
import React, { useState } from "react";
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
import icons from "@/constants/icons";   // your own icon map
import FilterList from "@/component/filterList"; // your own filter component
import TopBar from "@/component/topBar";


interface Group {
  id: string;
  title: string;
  members: number;
  imageSrc: any; // replace “any” with whatever your GroupItem expects (e.g. ImageSourcePropType)
}

const Explore: React.FC = () => {
  // 1) State: list of groups
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "1",
      title: "CNPM",
      members: 3,
      imageSrc: images.avatar,
    },
    {
      id: "2",
      title: "CNPM 2",
      members: 5,
      imageSrc: images.avatar,
    },
  ]);

  // 2) State: modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // 3) State: input fields inside modal
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // 4) Handler: when “Save” is pressed inside modal
  const handleCreateGroup = () => {
    // Simple validation: must have at least a title
    if (newTitle.trim().length === 0) {
      // You can show an Alert or set an error message, etc.
      return;
    }

    // Create a new group object
    const newGroup: Group = {
      id: Date.now().toString(), // simple unique ID
      title: newTitle.trim(),
      members: 1, // you can adjust or let user input members if you want
      imageSrc: images.avatar, // replace with whatever default or uploaded image
    };

    // Add to the front (or end) of array
    setGroups((prev) => [newGroup, ...prev]);

    // Reset inputs & close modal
    setNewTitle("");
    setNewDescription("");
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView
        className="p-3"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* ───────────────────────────────── Header ───────────────────────────────── */}
        

        <TopBar
          title="Group"
          />


        <View className="mt-3" />

        <FilterList />

        <View className="mt-5 space-y-3">
          {groups.map((g) => (
            <GroupItem
              key={g.id}
              title={g.title}
              members={g.members}
              imageSrc={g.imageSrc}
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
        {/* Optional: to push content up when keyboard opens */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center items-center bg-black/30"
        >
          <View className="bg-white w-11/12 mx-2 rounded-2xl p-5">
            {/* Close button */}
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
                source={images.onboarding2 /* your illustration asset */}
                style={{ width: 300, height: 250, resizeMode: "contain" }}
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
