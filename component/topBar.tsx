import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { getNotifications } from '@/api/notification/notification'

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
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    let isMounted = true
    getNotifications().then((notifications) => {
      if (isMounted) {
        const count = notifications.filter((n) => !n.isRead).length
        setUnreadCount(count)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: 'white',
        position: 'relative',
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
          <View style={{ position: 'relative', padding: 4 }}>
            <Ionicons name="notifications-outline" size={24} color="#4A4A4A" />
            {unreadCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  backgroundColor: '#FF0004',
                  borderRadius: 999,
                  paddingHorizontal: 4,
                  minWidth: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  )
}

export default TopBar
