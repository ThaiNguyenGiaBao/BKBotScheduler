import { View, Text } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import { useState } from "react";
const FilterItem = ({ name }: { name: string }) => {
  const [selected, setSelected] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => setSelected(!selected)}
      className={`flex ${
        selected ? "text-white bg-primary-300" : "text-gray-800 bg-blue-100"
      } flex-row items-center bg-gray-100 rounded-full px-3 font-rubik  mt-2`}
    >
      <Text>
            {name}

      </Text>
    </TouchableOpacity>
  );
};

const FilterList = () => {
  const filterItems = [
    "All", "Meeting", "Work", "Entertainment", "Others"]
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex flex-row gap-3">
        {filterItems.map((item, index) => (
          <FilterItem key={index} name={item} />
        ))}
      </View>
    </ScrollView>
  );
};

export default FilterList;
