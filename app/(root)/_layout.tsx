// app/(root)/_layout.tsx
import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

// For other page except Sign In Page
const AppLayout = () => {
  return (
    <GestureHandlerRootView>
      <Slot />
    </GestureHandlerRootView>
  )
}

export default AppLayout
