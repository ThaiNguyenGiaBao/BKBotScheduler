import React, { useEffect } from 'react'
import { Slot } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { enableScreens } from 'react-native-screens'
import * as Updates from 'expo-updates'
import {
  initializeNotifications,
  setupNotificationListeners,
} from '@/utils/notificationSetup'
import { notificationService } from '@/services/notificationService'
import { Alert } from 'react-native'

// Enable react-native-screens for performance
enableScreens()

const AppLayout = () => {
  useEffect(() => {
    const init = async () => {
      // Check for OTA update
      try {
        const update = await Updates.checkForUpdateAsync()
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync()
          Alert.alert('Update available', 'Restart now to apply update?', [
            { text: 'Later' },
            { text: 'Restart', onPress: () => Updates.reloadAsync() },
          ])
        }
      } catch (e) {
        console.warn('Update check failed:', e)
      }

      // Init notifications
      const success = await initializeNotifications()
      if (success) {
        console.log('✅ Notifications ready')
        notificationService.startPolling()
      }
    }

    init()

    const cleanup = setupNotificationListeners()

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
