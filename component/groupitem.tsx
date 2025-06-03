// File: GroupItem.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import images from "@/constants/images";

interface GroupItemProps {
  groupId: string;
  title: string;
  members: number;
    description?: string; // optional field
  imageSrc: any; // or ImageSourcePropType if you’ve typed it
}

const GroupItem: React.FC<GroupItemProps> = ({
  groupId,
  title = "CNPM",
  members = 3,
    description = "Group for CNPM course discussions",
  imageSrc = images.avatar,
}) => {
  const router = useRouter();

  const onPressGroup = () => {
    // Navigates to: /group/<groupId>
    router.push({
      pathname: "/group/events/[groupId]",
      params: { groupId },
    });
  };

  return (
    <TouchableOpacity
      onPress={onPressGroup}
      activeOpacity={0.7}
      style={styles.cardContainer}
    >
      <Image
        source={imageSrc}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
       
        <Text style={styles.titleText}>{title}</Text>
        <Text style={{ fontSize: 14, color: "#6B7280" }}>{description}</Text>

        <Text style={styles.membersText} className="">{members} members</Text>

      </View>
    </TouchableOpacity>
  );
};

export default GroupItem;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#D1D5DB", // gray-300
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 35,
    marginRight: 16,
    // cover
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E40AF", // blue-700
    marginBottom: 2,
  },
  membersText: {
    fontSize: 14,
    marginTop: 2,
    color: "#374151", // gray-700
  },
});
