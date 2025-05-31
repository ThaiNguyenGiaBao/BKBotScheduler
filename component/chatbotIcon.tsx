import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import icons from '@/constants/icons'

const ChatBotIcon = () => {
  const router = useRouter()
  return (
    <TouchableOpacity
      onPress={() => router.push('/(root)/(tabs)/chat')}
      style={{
        position: 'absolute',
        bottom: 75,
        right: 10,
        shadowColor: '#00000080',
        shadowOffset: { width: 10, height: 10 },
      }}
    >
      <Image
        source={icons.chatbot}
        style={{
          width: 50,
          height: 50,
          borderRadius: 999,
        }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  )
}
export default ChatBotIcon
