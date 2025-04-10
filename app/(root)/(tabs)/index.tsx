import icons from '@/constants/icons'
import images from '@/constants/images'
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Home() {
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="p-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
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
          <Image source={icons.bell} style={{ width: 24, height: 24 }} />
        </View>

        {/* Banner */}
        <View className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-5 mb-6">
          <Text className="text-white font-bold text-lg text-center">
            Quản lý thời gian với BKBotScheduler!
          </Text>
        </View>

        {/* Overview */}
        <Text className="font-bold text-lg mb-4">Tổng quan</Text>

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
      </ScrollView>
    </SafeAreaView>
  )
}
