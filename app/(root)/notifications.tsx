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
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Ionicons } from '@expo/vector-icons'
import Entypo from '@expo/vector-icons/Entypo'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router } from 'expo-router'
import TopBar from '@/component/topBar'
import icons from '@/constants/icons'
import { Notification } from '@/api/notification/types'
import { getNotifications } from '@/api/notification/notification'

dayjs.extend(relativeTime)

const filters = ['All', 'Today', 'This week', 'Previous']

const Notifications = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getNotifications()
        console.log(data)
        setNotifications(data)
      } catch (error) {
        console.error('Failed to load notifications', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filterNotifications = () => {
    const now = dayjs()
    return notifications.filter((noti) => {
      const date = dayjs(noti.createTime)
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
      const date = dayjs(noti.createTime)
      if (date.isSame(now, 'day')) today.push(noti)
      else if (date.isAfter(now.startOf('week'))) thisWeek.push(noti)
      else previous.push(noti)
    }

    return { today, thisWeek, previous }
  }

  const grouped = groupNotifications()

  const handleGotoGroup = (groupId: string) => {
    console.log('Navigate to group:', groupId)
    setModalVisible(false)
    router.push(`/(root)/(tabs)/group/members/${groupId}`)
  }

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
          {item.groupName ? item.groupName : item.title}
        </Text>
        <Text numberOfLines={1} style={{ color: '#191D31', fontSize: 16 }}>
          {item.body}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          <Entypo name="back-in-time" size={14} color="#666876" />
          <Text style={{ color: '#666876', marginLeft: 4, fontSize: 12 }}>
            {dayjs(item.createTime).fromNow()}
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
                width: '85%',
                maxHeight: '80%',
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ position: 'absolute', top: 15, right: 15, zIndex: 1 }}
              >
                <MaterialCommunityIcons
                  name="close-circle-outline"
                  size={28}
                  color="#666876"
                />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: 20,
                  color: '#191D31',
                }}
              >
                Notification
              </Text>

              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                <Image
                  source={icons.chatbot}
                  style={{ width: 100, height: 100, borderRadius: 12 }}
                />
              </View>

              <View
                style={{
                  backgroundColor: '#0061FF1A',
                  borderRadius: 12,
                  marginBottom: 8,
                  padding: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#191D31',
                    textAlign: 'center',
                  }}
                >
                  Group:
                </Text>
                <Text
                  selectable
                  style={{
                    fontSize: 16,
                    color: '191D31',
                    fontWeight: '500',
                    textAlign: 'center',
                  }}
                >
                  {selectedNotification?.groupName || 'N/A'}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: '#0061FF1A',
                  borderRadius: 12,
                  marginBottom: 8,
                  padding: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#191D31',
                    marginBottom: 8,
                    textAlign: 'center',
                  }}
                >
                  Content:
                </Text>
                <Text
                  selectable
                  style={{
                    fontSize: 15,
                    color: '#191D31',
                    textAlign: 'center',
                  }}
                >
                  {selectedNotification?.body || 'N/A'}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: '#0061FF1A',
                  borderRadius: 12,
                  padding: 8,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#191D31',
                    textAlign: 'center',
                  }}
                >
                  Date:
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#191D31',
                    textAlign: 'center',
                  }}
                >
                  {selectedNotification?.createTime
                    ? dayjs(selectedNotification.createTime).format(
                        'HH:mm:ss - DD/MM/YYYY'
                      )
                    : 'N/A'}
                </Text>
              </View>

              {selectedNotification?.groupName && (
                <TouchableOpacity
                  onPress={() =>
                    handleGotoGroup(selectedNotification.groupId as string)
                  }
                  style={{
                    backgroundColor: '#0061FF1A',
                    borderRadius: 12,
                    paddingVertical: 8,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#0061FF',
                      fontSize: 16,
                      fontWeight: '600',
                    }}
                  >
                    Goto {selectedNotification.groupName}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <TopBar title="Notifications" showNotiIcon={false} />
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" color="#0061FF" />
          <Text style={{ marginTop: 12, fontSize: 16, color: '#666' }}>
            Loading notifications...
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
          {grouped.today.length === 0 &&
            grouped.thisWeek.length === 0 &&
            grouped.previous.length === 0 && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 20,
                }}
              >
                <Ionicons
                  name="notifications-off-outline"
                  size={64}
                  color="#ccc"
                />
                <Text style={{ fontSize: 16, color: '#999', marginTop: 10 }}>
                  Không có thông báo
                </Text>
              </View>
            )}

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
