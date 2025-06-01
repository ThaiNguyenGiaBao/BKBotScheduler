import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import icons from '@/constants/icons'
import TopBar from '@/component/topBar'

dayjs.extend(relativeTime)

// Mock data
const notifications = [
  {
    id: '1',
    title: 'CNPM - TN01',
    content: 'Tạo Prototype Figma',
    time: dayjs().subtract(7, 'minute').toISOString(),
  },
  {
    id: '2',
    title: 'PPL',
    content: 'Làm BTL PPL 2',
    time: dayjs().subtract(2, 'hour').toISOString(),
  },
  {
    id: '3',
    title: 'CNPM - TN01',
    content: 'Đi học Lập Trình Mobile...',
    time: dayjs().subtract(9, 'hour').toISOString(),
  },
  {
    id: '4',
    title: 'Sinh hoạt công dân',
    content: 'Đăng ký môn học HK 243',
    time: dayjs().subtract(3, 'day').toISOString(),
  },
  {
    id: '5',
    title: 'Mạng máy tính',
    content: 'Họp nhóm BTL',
    time: dayjs().subtract(20, 'day').toISOString(),
  },
]

const filters = ['All', 'Today', 'This week', 'Previous months']

const getFilteredNotifications = (filter: string) => {
  const now = dayjs()
  return notifications.filter((noti) => {
    const date = dayjs(noti.time)

    switch (filter) {
      case 'Today':
        return date.isSame(now, 'day')
      case 'This week':
        return date.isAfter(now.startOf('week')) && !date.isSame(now, 'day')
      case 'Previous months':
        return date.isBefore(now.startOf('week'))
      default:
        return true
    }
  })
}

const groupNotifications = (notis: typeof notifications) => {
  const today = []
  const thisWeek = []
  const previousMonths = []

  const now = dayjs()

  for (const noti of notis) {
    const date = dayjs(noti.time)
    if (date.isSame(now, 'day')) {
      today.push(noti)
    } else if (date.isAfter(now.startOf('week'))) {
      thisWeek.push(noti)
    } else {
      previousMonths.push(noti)
    }
  }

  return { today, thisWeek, previousMonths }
}

const Notifications = () => {
  const [selectedFilter, setSelectedFilter] = useState('All')

  const filtered = getFilteredNotifications(selectedFilter)
  const grouped = groupNotifications(filtered)

  const renderNotiCard = (item: any) => (
    <View
      key={item.id}
      style={{
        backgroundColor: item.id === '1' ? '#E5EEFF' : '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      }}
    >
      <Image
        source={icons.person}
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', color: '#0057FF' }}>
          {item.title}
        </Text>
        <Text>{item.content}</Text>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
        >
          <Ionicons name="time-outline" size={14} color="#888" />
          <Text style={{ color: '#888', marginLeft: 4, fontSize: 12 }}>
            {dayjs(item.time).fromNow()}
          </Text>
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      {/* Header */}
      <TopBar title="Chatbot" />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Filter Chips */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setSelectedFilter(f)}
              style={{
                backgroundColor: selectedFilter === f ? '#0057FF' : '#F1F1F1',
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 999,
              }}
            >
              <Text
                style={{
                  color: selectedFilter === f ? '#fff' : '#333',
                  fontWeight: '500',
                }}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications Grouped */}
        {grouped.today.length > 0 && (
          <>
            <Text
              style={{ fontWeight: 'bold', color: '#0057FF', marginBottom: 10 }}
            >
              Today
            </Text>
            {grouped.today.map(renderNotiCard)}
          </>
        )}
        {grouped.thisWeek.length > 0 && (
          <>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#0057FF',
                marginVertical: 10,
              }}
            >
              This week
            </Text>
            {grouped.thisWeek.map(renderNotiCard)}
          </>
        )}
        {grouped.previousMonths.length > 0 && (
          <>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#0057FF',
                marginVertical: 10,
              }}
            >
              Previous months
            </Text>
            {grouped.previousMonths.map(renderNotiCard)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Notifications
