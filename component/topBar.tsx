import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

interface TopBarProps {
  title: string
  showBackButton?: boolean
  showNotiIcon?: boolean
  onBackPress?: () => void
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  showBackButton = true,
  showNotiIcon = true,
  onBackPress,
}) => {
  const router = useRouter()

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 8,
        backgroundColor: 'white',
      }}
    >
      {showBackButton ? (
        <TouchableOpacity
          onPress={onBackPress || router.back}
          style={{
            backgroundColor: '#0061FF1A',
            padding: 8,
            borderRadius: 999,
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#191D31" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 28 }} />
      )}

      <Text style={{ fontSize: 24, fontWeight: '700', color: '#000' }}>
        {title}
      </Text>

      {showNotiIcon ? (
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
