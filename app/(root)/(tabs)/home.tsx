// app/(root)/(tabs)/home.tsx
import React, { useEffect, useState, useCallback } from 'react'
import {
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import Carousel from '@/component/carousel'
import icons from '@/constants/icons'
import * as Sentry from '@sentry/react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { getNotifications } from '@/api/notification/notification'
import api from '@/api'
import ChatBotIcon from '@/component/chatbotIcon'

interface UserData {
  id: string
  name: string
  email: string
  picture: string
  given_name: string
  family_name: string
}

interface Event {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  isPersonal: boolean
  type: string
  isComplete: boolean | null
  priority: number | null
  group_id: string
  groupName?: string
}

interface TaskProgress {
  completed: number
  total: number
  percentage: number
}

const TaskItem = ({
  title,
  groupName,
  time,
  isGroupEvent,
  eventType,
  isComplete,
  onPress,
}: {
  title: string
  time: string
  groupName?: string
  isGroupEvent?: boolean
  eventType?: string
  priority?: number | null
  isComplete?: boolean | null
  onPress?: () => void
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'EVENT':
        return 'bg-blue-100 text-blue-600'
      case 'TASK':
        return 'bg-orange-100 text-orange-600'
      case 'FOCUS_TIME':
        return 'bg-purple-100 text-purple-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className={`bg-white shadow-sm rounded-xl p-4 mb-3 flex-row justify-between items-center`}
      >
        <View className="flex-1">
          <View className="flex-row items-center mb-1 flex-wrap">
            <Text
              className={`font-semibold text-base flex-1 ${
                isComplete ? 'text-gray-400 line-through' : 'text-blue-600'
              }`}
            >
              {title}
            </Text>
            <View className="flex-row items-center gap-1 ml-2">
              {isGroupEvent && (
                <View className="bg-teal-100 px-2 py-1 rounded-full">
                  <Text className="text-teal-600 text-xs font-medium">
                    {groupName}
                  </Text>
                </View>
              )}
              {isComplete && (
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              )}
            </View>
          </View>
          <Text className="text-gray-500 text-sm">{time}</Text>
        </View>
        <Image source={icons.person} style={{ width: 24, height: 24 }} />
      </View>
    </TouchableOpacity>
  )
}

// Skeleton loader for avatar
const AvatarSkeleton = () => (
  <View
    style={{
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#f0f0f0',
    }}
  />
)

// Skeleton loader for text
const TextSkeleton = ({ width, height }: { width: number; height: number }) => (
  <View
    style={{
      width,
      height,
      backgroundColor: '#f0f0f0',
      borderRadius: 4,
    }}
  />
)

// Skeleton for progress cards
const ProgressSkeleton = () => (
  <View className="bg-white shadow-sm rounded-xl p-4 mb-4">
    <TextSkeleton width={120} height={16} />
    <View className="mt-2 mb-2">
      <TextSkeleton width={80} height={14} />
    </View>
    <View className="h-2 bg-gray-200 rounded-full" />
  </View>
)

export default function Home() {
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  const [events, setEvents] = useState<Event[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [todayProgress, setTodayProgress] = useState<TaskProgress>({
    completed: 0,
    total: 0,
    percentage: 0,
  })
  const [weekProgress, setWeekProgress] = useState<TaskProgress>({
    completed: 0,
    total: 0,
    percentage: 0,
  })
  const [nextMeeting, setNextMeeting] = useState<Event | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  // Format date for display
  const formatEventTime = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()

    const isToday = end.toDateString() === now.toDateString()
    const isTomorrow =
      end.toDateString() ===
      new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString()

    const timeString = `${end.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`

    const formatDate = (date: Date) =>
      `${String(date.getDate()).padStart(2, '0')}/${String(
        date.getMonth() + 1
      ).padStart(2, '0')}/${date.getFullYear()}`

    if (isToday) {
      return `Today, ${timeString}`
    } else if (isTomorrow) {
      return `Tomorrow, ${timeString}`
    } else {
      const daysDiff = Math.ceil(
        (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysDiff <= 7) {
        return `${daysDiff} days left, ${timeString}`
      }
      return `${formatDate(end)}, ${timeString}`
    }
  }

  // Calculate progress for today and this week
  const calculateProgress = (events: Event[]) => {
    const now = new Date()
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
    const startOfWeek = new Date(
      startOfDay.getTime() - startOfDay.getDay() * 24 * 60 * 60 * 1000
    )
    const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)

    // Today's events
    const todayEvents = events.filter((event) => {
      const eventDate = new Date(event.startDate)
      return eventDate >= startOfDay && eventDate < endOfDay
    })

    // This week's events
    const weekEvents = events.filter((event) => {
      const eventDate = new Date(event.startDate)
      return eventDate >= startOfWeek && eventDate < endOfWeek
    })

    // Use isComplete field to determine completion status
    const todayCompleted = todayEvents.filter(
      (event) => event.isComplete === true
    ).length
    const weekCompleted = weekEvents.filter(
      (event) => event.isComplete === true
    ).length

    setTodayProgress({
      completed: todayCompleted,
      total: todayEvents.length,
      percentage:
        todayEvents.length > 0
          ? (todayCompleted / todayEvents.length) * 100
          : 0,
    })

    setWeekProgress({
      completed: weekCompleted,
      total: weekEvents.length,
      percentage:
        weekEvents.length > 0 ? (weekCompleted / weekEvents.length) * 100 : 0,
    })
  }

  // Find next meeting
  const findNextMeeting = (events: Event[]) => {
    const now = new Date()
    const upcomingEvents = events
      .filter((event) => new Date(event.startDate) > now)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )

    setNextMeeting(upcomingEvents.length > 0 ? upcomingEvents[0] : null)
  }

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setUserLoading(true)
      const res = await api.get('/auth')
      setUserData(res.data.user)
    } catch (error) {
      console.error('Failed to load user data in home', error)
      Sentry.captureException(error)
    } finally {
      setUserLoading(false)
    }
  }

  const createUniqueEventKey = (event: Event) => {
    return `${event.isPersonal ? 'personal' : 'group'}-${event.id}-${
      event.group_id || 'no-group'
    }`
  }
  const removeDuplicateEvents = (events: Event[]) => {
    const eventMap = new Map<string, Event>()

    events.forEach((event) => {
      const uniqueId = `${event.title}-${event.startDate}-${event.endDate}-${
        event.group_id || 'personal'
      }`
      if (!eventMap.has(uniqueId)) {
        eventMap.set(uniqueId, event)
      }
    })

    return Array.from(eventMap.values())
  }

  // Fetch events
  const fetchEvents = async () => {
    try {
      setEventsLoading(true)

      // Fetch personal events
      const personalEventsRes = await api.get('/events')
      const eventsData =
        personalEventsRes.data.events || personalEventsRes.data || []
      const personalEvents = eventsData.map((event: any) => ({
        id: event.id,
        title: event.summary || event.title || 'Untitled Event',
        description: event.description || '',
        startDate: event.startTime,
        endDate: event.endTime,
        isPersonal: true,
        type: event.type,
        isComplete: event.isComplete,
        priority: event.priority,
        group_id: event.group_id,
      }))

      // Fetch group events
      const groupsRes = await api.get('/groups')
      const groups = groupsRes.data.groups || []
      let allGroupEvents: Event[] = []

      for (const group of groups) {
        try {
          const groupEventsRes = await api.get(`/events/group/${group.id}`)
          const groupEventsData =
            groupEventsRes.data.events || groupEventsRes.data || []

          if (Array.isArray(groupEventsData)) {
            const groupEvents = groupEventsData.map((event: any) => ({
              id: event.id,
              title: event.summary || event.title || 'Untitled Event',
              description: event.description || '',
              startDate: event.startTime,
              endDate: event.endTime,
              isPersonal: false,
              type: event.type,
              isComplete: event.isComplete,
              priority: event.priority,
              group_id: group.id,
              groupName: group.name,
            }))
            allGroupEvents = [...allGroupEvents, ...groupEvents]
          }
        } catch (error) {
          console.error(`Failed to fetch events for group ${group.id}:`, error)
        }
      }

      // Combine all events and remove duplicates
      const combinedEvents = [...personalEvents, ...allGroupEvents]
      // const uniqueEvents = removeDuplicateEvents(combinedEvents)
      const uniqueEvents = combinedEvents.filter((event) => !event.isPersonal)

      setEvents(uniqueEvents)
      calculateProgress(uniqueEvents)
      findNextMeeting(uniqueEvents)
    } catch (error) {
      console.error('Failed to load events:', error)
      Sentry.captureException(error)
    } finally {
      setEventsLoading(false)
    }
  }

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const notifications = await getNotifications()
      const count = notifications.filter((n) => !n.isRead).length
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to load notifications:', error)
      Sentry.captureException(error)
    }
  }

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([fetchUserData(), fetchEvents(), fetchNotifications()])
    setRefreshing(false)
  }, [])

  // Load data on mount
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      if (isMounted) {
        await Promise.all([
          fetchUserData(),
          fetchEvents(),
          fetchNotifications(),
        ])
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  // Get upcoming events for display (next 5 events)
  const getUpcomingEvents = () => {
    const now = new Date()
    return events
      .filter((event) => new Date(event.startDate) > now)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )
      .slice(0, 5)
  }

  const upcomingEvents = getUpcomingEvents()

  return (
    <SafeAreaView className="bg-white h-full">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4 p-4 pb-0">
        <View className="flex-row items-center gap-2">
          {/* Avatar with loading state */}
          {userLoading || !userData?.picture ? (
            <AvatarSkeleton />
          ) : (
            <Image
              source={{ uri: userData.picture }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          )}

          <View>
            <Text className="text-gray-500 text-sm">{getGreeting()}</Text>
            {/* Username with loading state */}
            {userLoading || !userData?.name ? (
              <TextSkeleton width={120} height={18} />
            ) : (
              <Text className="font-bold text-base">{userData.name}</Text>
            )}
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

      <ScrollView
        className="p-4 mb-8"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Banner */}
        <View className="flex justify-center justify-items-center">
          <Carousel />
        </View>

        {/* Overview */}
        <View>
          <Text className="font-bold text-xl mb-4 text-center">Overview</Text>

          {/* Progress Today */}
          {eventsLoading ? (
            <ProgressSkeleton />
          ) : (
            <View className="bg-white shadow-sm rounded-xl p-4 mb-4">
              <Text className="font-semibold mb-1">Today Progress</Text>
              <Text className="text-sm mb-2">
                {todayProgress.completed}/{todayProgress.total} Done
              </Text>
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-2 bg-blue-600 rounded-full"
                  style={{ width: `${todayProgress.percentage}%` }}
                />
              </View>
            </View>
          )}

          {/* Progress This Week */}
          {eventsLoading ? (
            <ProgressSkeleton />
          ) : (
            <View className="bg-white shadow-sm rounded-xl p-4 mb-4">
              <Text className="font-semibold mb-1">Week Progress</Text>
              <Text className="text-sm mb-2">
                {weekProgress.completed}/{weekProgress.total} Done
              </Text>
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-2 bg-blue-600 rounded-full"
                  style={{ width: `${weekProgress.percentage}%` }}
                />
              </View>
            </View>
          )}

          {/* Next Meeting */}
          <View className="bg-white shadow-sm rounded-xl p-4 mb-6">
            <Text className="font-semibold mb-2">Next meeting</Text>
            {eventsLoading ? (
              <View className="bg-gray-100 p-3 rounded-lg">
                <TextSkeleton width={200} height={16} />
                <View className="mt-2">
                  <TextSkeleton width={150} height={14} />
                </View>
              </View>
            ) : nextMeeting ? (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/group/events/[groupId]',
                    params: { groupId: nextMeeting.group_id },
                  })
                }
              >
                <View className="bg-teal-50 p-3 rounded-lg">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-teal-600 font-semibold flex-1">
                      {nextMeeting.description}
                    </Text>
                    {!nextMeeting.isPersonal && nextMeeting.groupName && (
                      <View className="bg-teal-100 px-2 py-1 rounded-full ml-2">
                        <Text className="text-teal-600 text-xs font-medium">
                          {nextMeeting.groupName}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-gray-500 text-sm mt-1">
                    {formatEventTime(nextMeeting.endDate)}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View className="bg-gray-50 p-3 rounded-lg">
                <Text className="text-gray-500 text-center">
                  No upcoming meeting
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Upcoming Events */}
        <Text className="font-bold text-xl mb-4 text-center">Task(s)</Text>

        {eventsLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <View
              key={`skeleton-${index}`} // Ensure unique keys for skeletons
              className="bg-white shadow-sm rounded-xl p-4 mb-3"
            >
              <TextSkeleton width={200} height={16} />
              <View className="mt-2">
                <TextSkeleton width={120} height={14} />
              </View>
            </View>
          ))
        ) : upcomingEvents.length > 0 ? (
          upcomingEvents
            .filter((event) => !event.isPersonal)
            .map((event, index) => (
              <TaskItem
                key={createUniqueEventKey(event)} // Use unique key function
                title={event.description || event.title}
                groupName={event.groupName || ''}
                time={formatEventTime(event.endDate)}
                isGroupEvent={!event.isPersonal}
                eventType={event.type}
                priority={event.priority}
                isComplete={event.isComplete}
                onPress={() =>
                  router.push({
                    pathname: '/group/events/[groupId]',
                    params: { groupId: event.group_id },
                  })
                }
              />
            ))
        ) : (
          <View className="bg-white shadow-sm rounded-xl p-4 mb-3">
            <Text className="text-gray-500 text-center">No upcoming event</Text>
          </View>
        )}
      </ScrollView>
      <ChatBotIcon />
    </SafeAreaView>
  )
}
