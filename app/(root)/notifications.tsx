// app/(root)/notifications.tsx
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Ionicons } from '@expo/vector-icons'
import Entypo from '@expo/vector-icons/Entypo'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

import TopBar from '@/component/topBar'
import icons from '@/constants/icons'
import { Notification } from '@/api/notification/types'
import { getNotifications } from '@/api/notification/notification'

dayjs.extend(relativeTime)

const filters = ['All', 'Today', 'This week', 'Previous']

const Notifications = () => {
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotifications()
        console.log(data)
        const enriched = data.map((noti) => ({
          ...noti,
          createdAt: dayjs()
            .subtract(Math.floor(Math.random() * 10), 'day')
            .toISOString(), // Fake createdAt
        }))
        setNotifications(enriched)
      } catch (error) {
        console.error('Failed to load notifications', error)
      }
    }
    fetchData()
  }, [])

  const filterNotifications = () => {
    const now = dayjs()
    return notifications.filter((noti) => {
      const date = dayjs(noti.createdAt)
      switch (selectedFilter) {
        case 'Today':
          return date.isSame(now, 'day')
        case 'This week':
          return date.isAfter(now.startOf('week')) && !date.isSame(now, 'day')
        case 'Previous':
          return date.isBefore(now.startOf('week'))
        default:
          return true
      }
    })
  }

  const groupNotifications = () => {
    const now = dayjs()
    const today: Notification[] = []
    const thisWeek: Notification[] = []
    const previous: Notification[] = []

    for (const noti of filterNotifications()) {
      const date = dayjs(noti.createdAt)
      if (date.isSame(now, 'day')) today.push(noti)
      else if (date.isAfter(now.startOf('week'))) thisWeek.push(noti)
      else previous.push(noti)
    }

    return { today, thisWeek, previous }
  }

  const grouped = groupNotifications()

  const renderNotiCard = (item: Notification, index: number) => (
    <TouchableOpacity
      key={index}
      style={{
        backgroundColor: item.isRead ? '#FFFFFF' : '#0061FF1A',
        borderWidth: 1,
        borderColor: '#666876',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      }}
      onPress={() => {
        setSelectedNotification(item)
        setModalVisible(true)
      }}
    >
      <Image
        source={icons.chatbot}
        style={{ width: 80, height: 80, borderRadius: 20, marginRight: 10 }}
      />
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{ fontWeight: '700', color: '#0061FF', fontSize: 20 }}
        >
          {item.title}
        </Text>
        <Text numberOfLines={1} style={{ color: '#191D31', fontSize: 16 }}>
          {item.body}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          <Entypo name="back-in-time" size={14} color="#666876" />
          <Text style={{ color: '#666876', marginLeft: 4, fontSize: 12 }}>
            {dayjs(item.createdAt).fromNow()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderModal = () => (
    <Modal visible={modalVisible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: '#fff',
                padding: 20,
                borderRadius: 20,
                width: '80%',
                maxHeight: '80%',
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ position: 'absolute', top: 10, right: 10 }}
              >
                <MaterialCommunityIcons
                  name="close-circle-outline"
                  size={24}
                  color="#666876"
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: 10,
                }}
              >
                Notification
              </Text>

              <Image
                source={icons.chatbot}
                style={{ width: 120, height: 120, alignSelf: 'center' }}
              />

              <Text
                style={{
                  marginTop: 20,
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                Group ID
              </Text>
              <Text
                selectable
                style={{ textAlign: 'center', marginBottom: 10 }}
              >
                {selectedNotification?.groupId || 'N/A'}
              </Text>

              <Text style={{ fontWeight: '600', textAlign: 'center' }}>
                Content
              </Text>
              <Text
                selectable
                style={{ textAlign: 'center', marginBottom: 10 }}
              >
                {selectedNotification?.body || 'N/A'}
              </Text>

              <Text style={{ fontWeight: '600', textAlign: 'center' }}>
                Time
              </Text>
              <Text style={{ textAlign: 'center' }}>
                {selectedNotification?.createdAt
                  ? dayjs(selectedNotification.createdAt).format(
                      'HH:mm:ss - DD/MM/YYYY'
                    )
                  : 'N/A'}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <TopBar title="Notifications" />
      {grouped.today.length === 0 &&
      grouped.thisWeek.length === 0 &&
      grouped.previous.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
          <Text style={{ fontSize: 16, color: '#999', marginTop: 10 }}>
            Không có thông báo
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {/* Filter Buttons */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            {filters.map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setSelectedFilter(f)}
                style={{
                  backgroundColor:
                    selectedFilter === f ? '#0061FF' : '#0061FF0A',
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{
                    color: selectedFilter === f ? '#FFF' : '#191D31',
                    fontWeight: '500',
                  }}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Grouped Lists */}

          {grouped.today.length > 0 && (
            <>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#0057FF',
                  marginBottom: 10,
                }}
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
                This Week
              </Text>
              {grouped.thisWeek.map(renderNotiCard)}
            </>
          )}
          {grouped.previous.length > 0 && (
            <>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#0057FF',
                  marginVertical: 10,
                }}
              >
                Previous
              </Text>
              {grouped.previous.map(renderNotiCard)}
            </>
          )}
        </ScrollView>
      )}
      {renderModal()}
    </SafeAreaView>
  )
}

export default Notifications
