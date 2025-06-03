// services/notificationService.ts
import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getNotifications } from '../api/notification/notification'
import { Notification } from '../api/notification/types'
import { Platform } from 'react-native'

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

class NotificationService {
  private pollingInterval: NodeJS.Timeout | null = null
  private readonly STORAGE_KEY = 'seen_notification_ids'
  private readonly POLL_INTERVAL = 30000 // 30 seconds

  constructor() {
    this.setupNotificationChannel()
  }

  private async setupNotificationChannel() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#0061FF',
      })
    }
  }

  /**
   * Start polling for new notifications
   */
  async startPolling(): Promise<void> {
    console.log('🔔 Starting notification polling...')

    // Request permissions first
    const hasPermission = await this.requestPermissions()
    if (!hasPermission) {
      console.warn('⚠️ Notification permissions not granted')
      return
    }

    // Set up polling interval
    this.pollingInterval = setInterval(async () => {
      await this.checkForNewNotifications()
    }, this.POLL_INTERVAL)
  }

  /**
   * Stop polling for notifications
   */
  stopPolling(): void {
    console.log('🔕 Stopping notification polling...')
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }
  }

  /**
   * Request notification permissions
   */
  private async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      return finalStatus === 'granted'
    } catch (error) {
      console.error('Error requesting notification permissions:', error)
      return false
    }
  }

  /**
   * Check for new notifications from API
   */
  private async checkForNewNotifications(): Promise<void> {
    try {
      const notifications = await getNotifications()
      const seenIds = await this.getSeenNotificationIds()

      // Filter out notifications we've already seen
      const newNotifications = notifications.filter(
        (notif: Notification) => !seenIds.includes(notif.id)
      )

      if (newNotifications.length > 0) {
        console.log(`📱 Found ${newNotifications.length} new notifications`)

        // Update seen IDs
        const updatedSeenIds = [
          ...seenIds,
          ...newNotifications.map((n) => n.id),
        ]
        await this.saveSeenNotificationIds(updatedSeenIds)

        // Show local notifications
        for (const notification of newNotifications) {
          await this.showLocalNotification(notification)
        }
      }
    } catch (error) {
      console.error('Error checking for new notifications:', error)
    }
  }

  /**
   * Show a local notification
   */
  private async showLocalNotification(
    notification: Notification
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title:
            notification.groupName || notification.title || 'New Notification',
          body: notification.body || 'You have a new notification',
          data: {
            notificationId: notification.id,
            groupId: notification.groupId,
            groupName: notification.groupName,
            body: notification.body,
            createTime: notification.createTime,
          },
          sound: true,
        },
        trigger: null, // Show immediately
      })

      console.log(
        `📩 Shown notification: ${notification.groupName || notification.title}`
      )
    } catch (error) {
      console.error('Error showing local notification:', error)
    }
  }

  /**
   * Get list of seen notification IDs from storage
   */
  private async getSeenNotificationIds(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error getting seen notification IDs:', error)
      return []
    }
  }

  /**
   * Save seen notification IDs to storage
   */
  private async saveSeenNotificationIds(ids: string[]): Promise<void> {
    try {
      // Keep only last 1000 IDs to prevent storage bloat
      const trimmedIds = ids.slice(-1000)
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedIds))
    } catch (error) {
      console.error('Error saving seen notification IDs:', error)
    }
  }

  /**
   * Clear all seen notification IDs (useful for testing)
   */
  async clearSeenNotifications(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY)
      console.log('🗑️ Cleared seen notifications')
    } catch (error) {
      console.error('Error clearing seen notifications:', error)
    }
  }

  /**
   * Test notification (for development)
   */
  async sendTestNotification(): Promise<void> {
    await this.showLocalNotification({
      id: `test-${Date.now()}`,
      title: 'Test Notification',
      body: 'This is a test notification from the app',
      groupName: 'TEST-GROUP',
      createTime: new Date().toISOString(),
      isRead: false,
    } as Notification)
  }

  /**
   * Get notification statistics
   */
  async getStats(): Promise<{ seenCount: number; isPolling: boolean }> {
    const seenIds = await this.getSeenNotificationIds()
    return {
      seenCount: seenIds.length,
      isPolling: this.pollingInterval !== null,
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService()
