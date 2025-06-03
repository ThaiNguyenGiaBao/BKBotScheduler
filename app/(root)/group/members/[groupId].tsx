import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // For trash and other icons
import { SafeAreaView, ScrollView } from "react-native";
import TopBar from "@/component/topBar"; // Assuming you have a TopBar component
import { useRouter } from "expo-router";
import images from "@/constants/images";
import MemberItem from "@/component/memberItem";
import { useLocalSearchParams } from "expo-router";
import api from "@/api"; // Assuming you have an API module for fetching data

interface Member {
  id: string;
  email: string;
  name: string;
}

const GroupSettings = ({}) => {
  const [group, setGroup] = useState({
    id: "1",
    name: "CNPM",
    numMember: 3,
    description: "Group for CNPM course discussions",
  });
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const tasksRemaining = 2;
  const [memberList, setMemberList] = useState<Member[]>([
    {
      id: "1",
      email: "tuan.nguyen123@hcmu.edu.vn",
      name: "Tuan Nguyen",
    },
    {
      id: "2",
      email: "hongphucle@gmail.com",
      name: "Hong Phuc Le",
    },
  ]);
  const router = useRouter();
  const handleRemoveMember = (memberId: string) => {};

  const [err, setErr] = useState("");

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      setErr("Please enter a valid email address.");
      return;
    }

    //navigation.navigate("AddMember"); // Navigate to add member screen
    try {
      console.log("groupId:", groupId);
      const response = await api.post("/groups/" + groupId + "/members", {
        email: newMemberEmail,
      });
      console.log("Member added successfully:", response.data);

      setModalVisible(false); // Close the modal after adding
      console.log("Added new member:", newMemberEmail);

      setMemberList((prevMembers) => [
        ...prevMembers,
        {
          id: Math.random().toString(),
          name: response.data.name || "New Member", // Use response data if available
          email: response.data.email || newMemberEmail, // Use response data if available
          isOwner: false, // Default to non-owner
        },
      ]);
    } catch (error: any) {
      console.log("Failed to add member:", error);
      setErr(error.response.data.message || "Failed to add member");

      // Optionally, you can show an alert or toast message here
    }

    setNewMemberEmail(""); // Clear the input field
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await api.get("/groups/" + groupId); // Adjust endpoint as needed
        setGroup(response.data || []);
        console.log("Fetched group:", response.data);
        setMemberList(response.data.users || []);
      } catch (error) {
        console.log("Failed to fetch group:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
       <TopBar
          title="Group Details"
          
        />
      <ScrollView
        className="p-3"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* ─────────────────────────── Header ─────────────────────────── */}
       
        <View style={styles.container}>
          <View className="flex-col items-center justify-center mb-6">
            <Image
              source={images.onboarding1} // Replace with actual avatar URL
              style={styles.avatar}
            />
            <View className="flex-col items-center">
              <Text className="text-2xl font-rubik">{group.name}</Text>
              <Text style={styles.tasksRemaining}>
                {memberList.length} members
              </Text>
              
            </View>
          </View>

          {/* Members Section */}
          <View className="mb-6 font-rubik-semibold text-lg">
            <Text style={styles.sectionTitle}>Members</Text>
            {memberList.map((member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </View>

          {/* Add Member Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>Add new member</Text>
            <Icon name="person-add" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
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
                Add New Member
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
              placeholder="New Member Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={newMemberEmail}
              onChangeText={(value: any) => setNewMemberEmail(value)}
              className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
            />
            <Text className="text-red-500 mb-2">{err}</Text>

            {/* Save Button */}
            <TouchableOpacity
              className="bg-blue-500 rounded-full py-3 items-center"
              onPress={handleAddMember}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "bold", flex: 1, textAlign: "center" },
  groupInfo: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  avatar: { width: 200, height: 200, borderRadius: 100, marginRight: 16 },
  tasksRemaining: { fontSize: 14, color: "#666" },
  changeLink: { fontSize: 14, color: "#007AFF", marginTop: 4 },
  membersSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  memberRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  memberAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 14 },
  ownerText: { fontSize: 12, color: "#666" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6F0FA",
    padding: 12,
    borderRadius: 20,
    marginBottom: 24,
  },
  addButtonText: { fontSize: 16, color: "#007AFF", marginRight: 8 },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
  },
  navText: { fontSize: 12, textAlign: "center" },
});

export default GroupSettings;
