// app/(root)/(tabs)/home.tsx
import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Button,
} from 'react-native'
import Carousel from '@/component/carousel'
import icons from '@/constants/icons'
import images from '@/constants/images'
import * as Sentry from '@sentry/react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { getNotifications } from '@/api/notification/notification'

const TaskItem = ({ title, time }: { title: string; time: string }) => (
  <View className="bg-white shadow-sm rounded-xl p-4 mb-3 flex-row justify-between items-center">
    <View>
      <Text className="text-blue-600 font-semibold text-base mb-1">
        {title}
      </Text>
      <Text className="text-gray-500 text-sm">{time}</Text>
    </View>
    <Image source={icons.person} style={{ width: 24, height: 24 }} />
  </View>
)

export default function Home() {
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
    <SafeAreaView className="bg-white h-full">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4 p-4 pb-0">
        <View className="flex-row items-center gap-2">
          <Image
            source={images.avatar}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
          <View>
            <Text className="text-gray-500 text-sm">Good morning</Text>
            <Text className="font-bold text-base">PingPongBKD</Text>
          </View>
        </View>
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
      </View>
      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View className="flex justify-center justify-items-center">
          <Carousel />
        </View>

        {/* Overview */}
        <View>
          <Text className="font-bold text-xl mb-4 text-center">Tổng quan</Text>

          {/* Progress Today */}
          <View className="bg-white shadow-sm rounded-xl p-4 mb-4">
            <Text className="font-semibold mb-1">Tiến độ hôm nay</Text>
            <Text className="text-sm mb-2">2/4 hoàn thành</Text>
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <View className="h-2 bg-blue-600 w-1/2 rounded-full" />
            </View>
          </View>

          {/* Progress This Week */}
          <View className="bg-white shadow-sm rounded-xl p-4 mb-4">
            <Text className="font-semibold mb-1">Tiến độ tuần này</Text>
            <Text className="text-sm mb-2">2/4 hoàn thành</Text>
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <View className="h-2 bg-blue-600 w-1/2 rounded-full" />
            </View>
          </View>

          {/* Next Meeting */}
          <View className="bg-white shadow-sm rounded-xl p-4 mb-6">
            <Text className="font-semibold mb-2">Cuộc họp tiếp theo</Text>
            <View className="bg-teal-50 p-3 rounded-lg">
              <Text className="text-teal-600 font-semibold">
                Đồ án tổng hợp - CNPM
              </Text>
              <Text className="text-gray-500 text-sm">
                19/11/2024, 9pm - 10pm
              </Text>
            </View>
          </View>
        </View>
        {/* Tasks */}
        <Text className="font-bold text-xl mb-4 text-center">Nhiệm vụ</Text>

        <TaskItem title="Thiết kế giao diện figma" time="Hôm nay, 9pm" />
        <TaskItem title="Học ngoại ngữ" time="Hôm nay, 10pm" />
        <TaskItem title="Hiện thực website BTL" time="2 ngày nữa, 11:59pm" />
        <TaskItem title="Đi khám bệnh" time="3 ngày nữa, 8am" />
        <TaskItem title="Kiến tập tại VNG" time="5 ngày nữa, 6:45am" />
      </ScrollView>
    </SafeAreaView>
  )
}
