import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // For trash and other icons
import { SafeAreaView, ScrollView } from "react-native";
import TopBar from "@/component/topBar"; // Assuming you have a TopBar component
import { useRouter } from "expo-router";
import images from "@/constants/images";
import MemberItem from "@/component/memberItem";

interface Member {
  id: string;
  name: string;
  email: string;
  isOwner: boolean;
}

interface GroupSettingsProps {
  groupId: string;
  groupName: string;
  tasksRemaining: number;
  members: Member[];
  onRemoveMember: (memberId: string) => void;
  onAddMember: () => void;
}

const GroupSettings = ({
  groupId,
  groupName = "CNPM - TN01",
  tasksRemaining = 2,
  members = [
    {
      id: "1",
      name: "tuan.nguyen123@hcmu...",
      email: "tuan.nguyen123@hcmu.edu.vn",
      isOwner: false,
    },
    {
      id: "2",
      name: "hongphucle@gmail.com",
      email: "hongphucle@gmail.com",
      isOwner: true,
    },
  ],
  onRemoveMember = () => {},
  onAddMember = () => {},
}: GroupSettingsProps) => {
  const router = useRouter();
  const handleRemoveMember = (memberId: string) => {
    onRemoveMember(memberId);
  };

  const handleAddMember = () => {
    onAddMember();
    //navigation.navigate("AddMember"); // Navigate to add member screen
  };

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
        <View style={styles.container}>
          <View className="flex-col items-center justify-center mb-6">
            <Image
              source={images.onboarding1} // Replace with actual avatar URL
              style={styles.avatar}
            />
            <View>
              <Text style={styles.groupName}>{groupName}</Text>
              <Text style={styles.tasksRemaining}>
                {tasksRemaining} tasks remaining
              </Text>
              <TouchableOpacity>
                <Text style={styles.changeLink}>Change name or image</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Members Section */}
          <View className="mb-6 font-rubik-semibold text-lg">
            <Text style={styles.sectionTitle}>Members</Text>
            {members.map((member) => (
                <MemberItem
                    key={member.id}
                    member={member}
                />
            ))}
          </View>

          {/* Add Member Button */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddMember}>
            <Text style={styles.addButtonText}>Add new member</Text>
            <Icon name="person-add" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "bold", flex: 1, textAlign: "center" },
  groupInfo: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  avatar: { width: 200, height: 200, borderRadius: 100, marginRight: 16 },
  groupName: { fontSize: 18, fontWeight: "bold" },
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
