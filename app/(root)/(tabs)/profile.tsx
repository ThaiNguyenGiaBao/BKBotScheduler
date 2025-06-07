// app/(root)/(tabs)/profile.tsx
import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import TopBar from '@/component/topBar'
import api, { tokenManager } from '@/api'
import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import ChatBotIcon from '@/component/chatbotIcon'

interface UserData {
  id: string
  name: string
  email: string
  picture: string
  given_name: string
  family_name: string
}

const Profile = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = async () => {
    console.log('Logout button pressed')
    setShowLogoutModal(true)
  }

  const confirmLogout = async () => {
    try {
      // Clear tokens from storage
      await tokenManager.clearTokens()

      // Optional: Revoke Google session
      // await WebBrowser.openAuthSessionAsync(
      //   'https://accounts.google.com/logout',
      //   'about:blank'
      // );

      // Navigate to root/onboarding
      router.replace('/')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setShowLogoutModal(false)
    }
  }

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get('/auth')
      setUserData(res.data.user)
    } catch (error) {
      console.error('Failed to load user data', error)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  // Skeleton/Loading component with shimmer effect
  const SkeletonLoader = ({
    width,
    height,
    borderRadius = 4,
  }: {
    width: number
    height: number
    borderRadius?: number
  }) => {
    const shimmerAnimation = useRef(new Animated.Value(0)).current

    useEffect(() => {
      const startShimmer = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(shimmerAnimation, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(shimmerAnimation, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start()
      }
      startShimmer()
    }, [])

    const shimmerOpacity = shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    })

    return (
      <View
        style={{
          width,
          height,
          borderRadius,
          backgroundColor: '#f0f0f0',
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            width: '100%',
            height: '100%',
            borderRadius,
            backgroundColor: '#e0e0e0',
            opacity: shimmerOpacity,
          }}
        />
      </View>
    )
  }

  const renderContent = () => {
    if (error) {
      return (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text className="mt-4 text-red-500 text-center">{error}</Text>
          <TouchableOpacity
            onPress={fetchUserData}
            className="mt-6 bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <ScrollView className="flex-1 bg-white">
        <View className="items-center pt-8 pb-6">
          {/* Avatar */}
          <View className="mb-6">
            {loading || !userData?.picture ? (
              <SkeletonLoader width={96} height={96} borderRadius={48} />
            ) : (
              <Image
                source={{ uri: userData.picture }}
                className="w-24 h-24 rounded-full"
                style={{ width: 96, height: 96, borderRadius: 48 }}
              />
            )}
          </View>

          {/* Info */}
          <View className="items-center mb-8">
            {loading || !userData?.name ? (
              <SkeletonLoader width={200} height={28} borderRadius={6} />
            ) : (
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                {userData.name}
              </Text>
            )}

            <View className="mt-2">
              {loading || !userData?.email ? (
                <SkeletonLoader width={250} height={20} borderRadius={4} />
              ) : (
                <Text className="text-gray-600 text-base">
                  {userData.email}
                </Text>
              )}
            </View>
          </View>

          {/* Actions */}
          <View className="w-full px-6 space-y-4">
            <TouchableOpacity
              className="bg-gray-800 py-4 px-6 rounded-full mx-4"
              style={{
                backgroundColor: '#191D31',
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 25,
                marginTop: 30,
                marginHorizontal: 16,
              }}
            >
              <Text
                className="text-white text-center text-lg font-medium"
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: '700',
                }}
              >
                Toggle dark mode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-100 py-4 px-6 rounded-full mx-4"
              style={{
                backgroundColor: '#FFBCBD80',
                paddingVertical: 16,
                paddingHorizontal: 24,
                borderRadius: 25,
                marginTop: 20,
                marginHorizontal: 16,
              }}
            >
              <Text
                className="text-red-600 text-center text-lg font-medium"
                style={{
                  color: '#FF0004',
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: '700',
                }}
              >
                Log out
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <View className="absolute inset-0 bg-opacity-50 justify-center items-center">
            <View className="bg-white mx-6 rounded-lg p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Logout
              </Text>
              <Text className="text-gray-600 mb-6">
                Are you sure you want to log out?
              </Text>
              <View className="flex-row justify-end space-x-3">
                <TouchableOpacity
                  onPress={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100"
                >
                  <Text className="text-gray-600">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmLogout}
                  className="px-4 py-2 rounded-lg bg-red-500"
                >
                  <Text className="text-white">Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar title="Profile" />
      {renderContent()}
      <ChatBotIcon />
    </SafeAreaView>
  )
}

export default Profile
