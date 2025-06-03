import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

interface TopBarProps {
  title: string
  showBackButton?: boolean
  showNotiIcon?: boolean
  onBackPress?: () => void
  rightIcon?: React.ReactNode
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  showBackButton = true,
  showNotiIcon = true,
  onBackPress,
  rightIcon = null,
}) => {
  const router = useRouter()

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: 'white',
        position: 'relative', // Enable absolute positioning for children
      }}
    >
      {showBackButton ? (
        <TouchableOpacity
          onPress={onBackPress || router.back}
          style={{
            backgroundColor: '#0061FF1A',
            padding: 8,
            borderRadius: 999,
            zIndex: 1,
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#191D31" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 28 }} />
      )}

      <Text
        style={{
          fontSize: 24,
          fontWeight: '500',
          color: '#000',
          position: 'absolute',
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>

      {rightIcon ? (
        rightIcon
      ) : showNotiIcon ? (
        <TouchableOpacity onPress={() => router.push('/(root)/notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#4A4A4A" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  )
}

export default TopBar
