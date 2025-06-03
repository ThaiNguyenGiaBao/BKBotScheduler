import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // For trash and other icons
import images from "@/constants/images";

const MemberItem = ({
  member,
}: {
  member: {
    id: string;
    name: string;
    isOwner: boolean;
  };
}) => {
  const handleRemoveMember = (memberId: string) => {
    // Logic to remove member
    console.log(`Removing member with ID: ${memberId}`);
  };
  return (
    <View key={member.id} style={styles.memberRow}>
      <Image
        source={images.avatar} // Replace with member avatar
        style={styles.memberAvatar}
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        {member.isOwner ? (
          <Text style={styles.ownerText}>Group owner</Text>
        ) : (
          <Text style={styles.ownerText}>Member</Text>
        )}
      </View>
      {!member.isOwner && (
        <TouchableOpacity onPress={() => handleRemoveMember(member.id)}>
          <Icon name="delete" size={20} color="#FF4444" />
        </TouchableOpacity>
      )}
    </View>
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

export default MemberItem;
