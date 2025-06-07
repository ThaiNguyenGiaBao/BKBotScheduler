// app/group/[groupId].tsx
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import images from '@/constants/images'
import TopBar from '@/component/topBar'
import { Group } from '@/types'
import api from '@/api'
import EventItem from '@/component/EventItem'
import DatePicker from '@/component/dateTimePicker'
import ChatBotIcon from '@/component/chatbotIcon'

interface Event {
  id: string
  description: string
  startTime: string
  endTime: string
}

export default function GroupDetail() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>()
  const router = useRouter()

  const [modalVisible, setModalVisible] = useState(false)
  const [isLoadingGroup, setIsLoadingGroup] = useState(true)
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const [isPosting, setIsPosting] = useState(false)

  const [group, setGroup] = useState<Group | null>(null)
  const [tasks, setTasks] = useState<Event[]>([])

  const [newEvent, setNewEvent] = useState<Event>({
    id: '',
    description: '',
    startTime: '',
    endTime: '',
  })

  const avatarSrc = images.avatar

  const handleEventChange = (field: keyof Event, value: string) => {
    setNewEvent((prev) => ({ ...prev, [field]: value }))
  }

  function formatTime(date: string): string {
    const d = new Date(date)
    if (isNaN(d.getTime())) return 'Invalid date'
    const hh = d.getHours().toString().padStart(2, '0')
    const mm = d.getMinutes().toString().padStart(2, '0')
    const DD = d.getDate().toString().padStart(2, '0')
    const MM = (d.getMonth() + 1).toString().padStart(2, '0')
    const YY = d.getFullYear().toString().slice(-2)
    return `${hh}:${mm}-${DD}/${MM}/${YY}`
  }

  const handleAddEvent = async () => {
    if (!newEvent.description || isPosting) return

    setIsPosting(true)

    const now = new Date()
    const oneHourLater = new Date(now.getTime() + 3600000)
    const startTime = newEvent.startTime || now.toISOString()
    const endTime = newEvent.endTime || oneHourLater.toISOString()

    try {
      const payload = {
        group_id: groupId,
        description: newEvent.description,
        startTime,
        endTime,
        isRecurring: false,
        isComplete: false,
        type: 'EVENT',
        priority: 1,
        summary: 'GROUP_EVENT',
      }
      const response = await api.post('events/group', payload)
      setTasks((prev) => [...prev, response.data])
      setNewEvent({ id: '', description: '', startTime: '', endTime: '' })
      setModalVisible(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsPosting(false)
    }
  }

  useEffect(() => {
    if (!groupId) return

    const fetchGroup = async () => {
      setIsLoadingGroup(true)
      try {
        const res = await api.get(`/groups/${groupId}`)
        setGroup(res.data)
      } catch {
        setGroup(null)
      } finally {
        setIsLoadingGroup(false)
      }
    }

    const fetchTasks = async () => {
      setIsLoadingTasks(true)
      try {
        const res = await api.get(`/events/group/${groupId}`)
        setTasks(res.data.events || [])
      } catch {
        setTasks([])
      } finally {
        setIsLoadingTasks(false)
      }
    }

    fetchGroup()
    fetchTasks()
  }, [groupId])

  const renderGroupHeader = () => {
    if (isLoadingGroup) {
      return (
        <View
          style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}
        >
          <View style={styles.skelAvatar} />
          <View style={{ flex: 1, gap: 4 }}>
            <View style={styles.skelLineShort} />
            <View style={styles.skelLineLong} />
            <View style={styles.skelLineTiny} />
          </View>
          <View style={styles.skelDot} />
        </View>
      )
    }

    if (!group) {
      return (
        <View
          style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}
        >
          <View style={styles.skelAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.notFoundTitle}>Group not found</Text>
            <Text style={styles.notFoundSub}>Unable to load group info</Text>
          </View>
        </View>
      )
    }

    return (
      <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
        <Image source={avatarSrc} style={styles.avatar} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.groupDesc}>{group.description}</Text>
          <Text style={styles.groupTasks}>
            {isLoadingTasks
              ? 'Loading tasks...'
              : `${tasks.length} tasks remaining`}
          </Text>
        </View>
        <TouchableOpacity
          style={{ padding: 8 }}
          onPress={() =>
            router.push({
              pathname: '/group/members/[groupId]',
              params: { groupId },
            })
          }
        >
          <Ionicons name="settings-outline" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>
    )
  }

  const renderTasksContent = () => {
    if (isLoadingTasks) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      )
    }

    if (tasks.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Image source={images.onboarding2} style={styles.emptyImage} />
          <Text style={styles.emptyTitle}>No tasks yet</Text>
          <Text style={styles.emptySub}>
            Create your first event to get started with group activities
          </Text>
        </View>
      )
    }

    return tasks.map((task) => (
      <EventItem
        key={task.id}
        task={task}
        formatTime={formatTime}
        setTasks={setTasks}
      />
    ))
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title="Group Details" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {renderGroupHeader()}

        {renderTasksContent()}

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Add new event</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ─────────── Add New Event Modal ─────────── */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
              >
                <ScrollView
                  contentContainerStyle={styles.modalScrollContainer}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={styles.modalCard}>
                    {/* Close */}
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.modalClose}
                    >
                      <MaterialCommunityIcons
                        name="close-circle-outline"
                        size={28}
                        color="#666876"
                      />
                    </TouchableOpacity>

                    {/* Title */}
                    <Text style={styles.modalTitle}>Add new event</Text>

                    {/* Illustration */}
                    <View style={styles.modalImageWrap}>
                      <Image
                        source={images.onboarding2}
                        style={styles.modalImage}
                        resizeMode="contain"
                      />
                    </View>

                    {/* Event Title Input */}
                    <View style={styles.fieldWrap}>
                      <TextInput
                        placeholder="Event Title"
                        placeholderTextColor="#666"
                        value={newEvent.description}
                        onChangeText={(v) =>
                          handleEventChange('description', v)
                        }
                        style={styles.fieldInput}
                      />
                    </View>

                    {/* DatePickers */}
                    <DatePicker
                      handleEventChange={handleEventChange}
                      event="startTime"
                      time={newEvent.startTime}
                    />
                    <DatePicker
                      handleEventChange={handleEventChange}
                      event="endTime"
                      time={newEvent.endTime}
                    />

                    <TouchableOpacity
                      onPress={handleAddEvent}
                      style={[
                        styles.modalSubmit,
                        !newEvent.description.trim() && {
                          backgroundColor: '#ccc',
                        },
                      ]}
                      disabled={!newEvent.description.trim() || isPosting}
                    >
                      {isPosting ? (
                        <ActivityIndicator size="small" color="#0061FF" />
                      ) : (
                        <Text
                          style={[
                            styles.modalSubmitText,
                            !newEvent.description.trim() && { color: '#999' },
                          ]}
                        >
                          Add
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <ChatBotIcon />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

  skelAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEE',
    marginRight: 12,
  },
  skelLineShort: {
    width: 120,
    height: 12,
    backgroundColor: '#EEE',
    borderRadius: 4,
    marginBottom: 4,
  },
  skelLineLong: {
    width: 180,
    height: 12,
    backgroundColor: '#EEE',
    borderRadius: 4,
    marginBottom: 4,
  },
  skelLineTiny: {
    width: 60,
    height: 12,
    backgroundColor: '#EEE',
    borderRadius: 4,
  },
  skelDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#EEE' },

  notFoundTitle: { fontSize: 18, fontWeight: '600', color: '#888' },
  notFoundSub: { color: '#AAA' },

  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  groupName: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
  groupDesc: { color: '#555' },
  groupTasks: { color: '#555' },

  loadingContainer: { alignItems: 'center', marginTop: 40 },
  loadingText: { marginTop: 12, color: '#666' },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 16,
  },
  emptyImage: { width: 120, height: 120, opacity: 0.5, marginBottom: 16 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  emptySub: { fontSize: 14, color: '#888', textAlign: 'center' },

  addButton: {
    backgroundColor: '#D6E4FF',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  addButtonText: { color: '#0061FF', fontSize: 16, fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  // Ensure the ScrollView grows and centers content
  modalScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },

  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },

  modalClose: { position: 'absolute', top: 25, right: 15, zIndex: 1 },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#191D31',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalImageWrap: { alignItems: 'center', marginBottom: 20 },
  modalImage: { width: 250, height: 180, borderRadius: 12 },
  fieldWrap: {
    backgroundColor: '#0061FF1A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  fieldInput: { fontSize: 16, color: '#191D31' },
  modalSubmit: {
    backgroundColor: '#D6E4FF',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSubmitText: { color: '#0061FF', fontSize: 16, fontWeight: '700' },
})
