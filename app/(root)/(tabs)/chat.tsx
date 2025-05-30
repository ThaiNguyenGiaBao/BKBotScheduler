import React from 'react'
import { SafeAreaView, ScrollView, View, Text } from 'react-native'

const Settings = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="p-3" showsHorizontalScrollIndicator={false}>
        <View className="flex flex-row justify-between items-center">
          <Text> Chatbot</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Settings
