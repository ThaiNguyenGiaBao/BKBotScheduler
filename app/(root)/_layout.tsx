// app/(root)/_layout.tsx
import React, { useEffect } from 'react'
import { Slot } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { enableScreens } from 'react-native-screens'
import {
  initializeNotifications,
  setupNotificationListeners,
} from '@/utils/notificationSetup'
import { notificationService } from '@/services/notificationService'

// Enable screens
enableScreens()

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
      notificationService.stopPolling()
    }
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
  )
}

export default AppLayout
