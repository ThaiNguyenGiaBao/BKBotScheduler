import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import api from "@/api";

const EventItem = ({
  task,
  formatTime,
  setTasks,
}: {
  task: {
    id: string;
    description: string;
    startTime: string;
    endTime: string;
  };
  formatTime: (time: string) => string;
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const handleDelete = async () => {
    try {
      await api.delete("/events/" + task.id);
      setTasks((prevTasks: any) =>
        prevTasks.filter((t: any) => t.id !== task.id)
      );
      // Optionally, you can show a success message or update the UI
      console.log("Event deleted successfully");
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  return (
    <View
      key={task.id}
      className="flex-row items-center justify-between border border-gray-300 rounded-lg px-3 py-3 mb-3"
    >
      <View>
        <Text className="text-base text-gray-800 flex-1">
          {task.description}
        </Text>
        <Text className="text-sm text-gray-500 ">
          {formatTime(task.startTime)} to {formatTime(task.endTime)}
        </Text>
      </View>

      <TouchableOpacity className="ml-5 p-1" onPress={handleDelete}>
        <Feather name="trash-2" size={20} color="#E02424" />
      </TouchableOpacity>

      {/* Right: Date/Time */}
    </View>
  );
};

export default EventItem;
