import { View, Text } from "react-native";
import React, { useState } from "react";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface TimePickerProps {
  handleEventChange: (event: any, selectedDate: string) => void;
  time: string;
  event: "startTime" | "endTime";
}

const TimePicker = ({ handleEventChange, time, event }: TimePickerProps) => {
  const [selectedDate, setSelectedDate] = useState(time ? new Date(time) : new Date());

  const handleTimeChange = (pickerEvent: DateTimePickerEvent, newDate?: Date) => {
    if (pickerEvent.type === "set" && newDate) {
      setSelectedDate(newDate);
      handleEventChange(event, newDate.toISOString());
    }
  };

  return (
    <View className="flex flex-row items-center bg-white mt-2 gap-2">
      <Text className="text-xl font-rubik" style={{ width: 90 }}>
        {event === "startTime" ? "Start time" : "End time"}
      </Text>
      <DateTimePicker
        value={selectedDate}
        mode="time"
        display="default"
        onChange={handleTimeChange}
      />
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="default"
        onChange={handleTimeChange}
      />
    </View>
  );
};

export default TimePicker;