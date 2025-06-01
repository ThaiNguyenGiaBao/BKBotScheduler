import React from 'react'
import { View, Image, TouchableOpacity, Platform } from 'react-native'
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
        ...Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: { width: 6, height: 6 },
            shadowOpacity: 1,
            shadowRadius: 6,
          },
          android: {
            elevation: 6,
          },
        }),
        backgroundColor: '#fff',
        borderRadius: 999,
        padding: 2,
        borderWidth: 1,
        borderColor: '#28D8FD',
      }}
    >
      <Image
        source={icons.chatbot}
        style={{
          width: 45,
          height: 45,
          borderRadius: 999,
        }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  )
}

export default ChatBotIcon
