import { View, Text } from "react-native";
import React from "react";
import { Image, StyleSheet } from "react-native";
import images from "@/constants/images";

const MemberItem = ({
  member,
}: {
  member: {
    id: string;
    email: string;
    name: string;
  };
}) => {
  const handleRemoveMember = (memberId: string) => {
    // Logic to remove member
    console.log(`Removing member with ID: ${memberId}`);
  };

  const shorten = (text: string, maxLength: number = 30) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <View
      key={member.id}
      style={styles.memberRow}
      className="rounded-lg border border-gray-300 p-3 mb-3 flex-row items-center"
    >
      <Image
        source={images.avatar} // Replace with member avatar
        style={styles.memberAvatar}
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName} className="font-rubik-semibold">{shorten(member.name)}</Text>
        <Text style={styles.memberName} className="text-gray-700">
          {shorten(member.email)}
        </Text>
      </View>
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
