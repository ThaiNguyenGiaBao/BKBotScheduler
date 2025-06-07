// utils/notificationSetup.ts
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import { Platform } from 'react-native'

/**
 * Setup notification listeners for the app
 * Call this in your main App component or _layout.tsx
 */
export function setupNotificationListeners() {
  // Handle notifications received while app is running
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log(
        '📱 Notification received while app is running:',
        notification
      )
      // You can show in-app banner or update badge here
    }
  )

  // Handle user tapping on notifications
  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('👆 User tapped notification:', response)

      const data = response.notification.request.content.data
      // Navigate based on notification data
      if (data?.groupId) {
        const groupId = data.groupId
        console.log('🚀 Navigating to group:', groupId)
        router.push({
          pathname: '/group/events/[groupId]',
          params: { groupId },
        })
      } else {
        // Navigate to notifications screen if no specific group
        router.push('/(root)/notifications')
      }
    })

  // Return cleanup function
  return () => {
    Notifications.removeNotificationSubscription(notificationListener)
    Notifications.removeNotificationSubscription(responseListener)
  }
}

/**
 * Initialize notification permissions and setup
 */
export async function initializeNotifications(): Promise<boolean> {
  try {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync()

    if (status !== 'granted') {
      console.warn('⚠️ Notification permissions not granted')
      return false
    }

    // Setup notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#0061FF',
        showBadge: true,
      })
    }

    console.log('✅ Notifications initialized successfully')
    return true
  } catch (error) {
    console.error('❌ Error initializing notifications:', error)
    return false
  }
}

/**
 * Clear all scheduled notifications
 */
export async function clearAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync()
    await Notifications.dismissAllNotificationsAsync()
    console.log('🗑️ All notifications cleared')
  } catch (error) {
    console.error('Error clearing notifications:', error)
  }
}
