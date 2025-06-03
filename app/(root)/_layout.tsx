import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import { Slot } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {
  initializeNotifications,
  setupNotificationListeners,
} from '@/utils/notificationSetup'
import { notificationService } from '@/services/notificationService'

// For other page except Sign In Page
const AppLayout = () => {
  useEffect(() => {
    // Initialize notifications
    const initNotifications = async () => {
      const success = await initializeNotifications()
      if (success) {
        console.log('✅ Notifications ready')
        notificationService.startPolling()
      }
    }

    initNotifications()

    // Setup notification listeners
    const cleanup = setupNotificationListeners()

    // Cleanup on unmount
    return () => {
      cleanup()
      notificationService.stopPolling() // ⬅️ Optional: stop polling on unmount
    }
  }, [])
  return (
    <GestureHandlerRootView>
      <Slot />
    </GestureHandlerRootView>
  )
}

export default AppLayout
