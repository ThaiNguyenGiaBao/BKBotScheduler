// app/index.tsx
import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'

import images from '@/constants/images'
import icons from '@/constants/icons'
import { useSignIn, useAuth } from '@clerk/clerk-expo'

const { width } = Dimensions.get('window')

const PAGES = [
  {
    key: '1',
    image: images.onboarding1,
    subtitle: 'WELCOME TO RBOTSCHEDULING',
    title: 'Optimizing Robot Scheduling For A Smarter Future.',
    description: '',
  },
  {
    key: '2',
    image: images.onboarding2,
    subtitle: '',
    title: 'Optimize Robot Tasks',
    description:
      'We make scheduling seamless by efficiently allocating tasks to robots. Just set the parameters, and let us handle the optimization.',
  },
  {
    key: '3',
    image: images.onboarding3,
    subtitle: '',
    title: 'Enhance Workflow Efficiency',
    description:
      'With RBOTSSCHEDULING, your automation system runs smarter—reducing downtime and improving overall productivity.',
  },
  {
    key: '4',
    image: images.onboarding4,
    subtitle: '',
    title: 'The Future Of Scheduling Starts Here.',
    description: '',
    showGoogleSignIn: true,
  },
]

const Onboarding = () => {
  const scrollRef = useRef<ScrollView>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(true)

  const { signIn, isLoaded } = useSignIn()
  const { isSignedIn } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return
    setLoading(true)
    setError(null)

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: 'yourapp://auth/callback',
        redirectUrlComplete: 'yourapp://auth/callback',
      })
    } catch (err: any) {
      console.error('OAuth error:', err)
      setError(err.message || 'Google Sign-In failed.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding')
      if (hasSeenOnboarding) {
        setCurrentPage(3)
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            x: 3 * width,
            animated: false,
          })
        }, 100)
      }
    }
    checkOnboardingStatus()
  }, [])

  useEffect(() => {
    if (isSignedIn) {
      AsyncStorage.setItem('hasSeenOnboarding', 'true')
      router.replace('/(root)/(tabs)/home')
    }
  }, [isSignedIn])

  const handleScroll = (e: any) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width)
    setCurrentPage(page)
  }

  const handleNext = async () => {
    if (currentPage < PAGES.length - 1) {
      scrollRef.current?.scrollTo({
        x: (currentPage + 1) * width,
        animated: true,
      })
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true')
      router.replace('/(root)/(tabs)/home')
    }
  }

  const handleBack = () => {
    if (currentPage > 0) {
      scrollRef.current?.scrollTo({
        x: (currentPage - 1) * width,
        animated: true,
      })
    }
  }

  if (!isOnboardingVisible) {
    return null
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerClassName="flex-row"
      >
        {PAGES.map((page) => (
          <View
            key={page.key}
            className="w-screen h-full items-center justify-center px-6"
          >
            <Image
              source={page.image}
              className="w-full mt-32"
              resizeMode="contain"
            />

            <View className="flex-1 items-center">
              {page.subtitle.length > 0 && (
                <Text className="uppercase text-gray-400">{page.subtitle}</Text>
              )}
              <Text className="text-3xl font-rubik-bold text-center mt-2">
                {page.title}
              </Text>
              {page.description.length > 0 && (
                <Text className="text-base text-center mt-4">
                  {page.description}
                </Text>
              )}

              {page.showGoogleSignIn && (
                <TouchableOpacity
                  className="shadow-md rounded-3xl bg-white p-3 mt-6 w-5/6"
                  onPress={handleGoogleSignIn}
                  disabled={loading}
                >
                  <View className="flex-row items-center justify-center">
                    <Image
                      source={icons.google}
                      style={{ width: 20, height: 20 }}
                    />
                    <Text className="font-rubik-medium ml-2 text-lg">
                      {loading ? 'Signing in...' : 'Sign in with Google'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              {currentPage === PAGES.length - 1 && error && (
                <Text className="text-red-500 mt-2 text-center">
                  {error}
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Page indicator */}
      <View className="absolute bottom-24 w-full flex-row justify-center space-x-2">
        {PAGES.map((_, idx) => (
          <View
            key={idx}
            className={`h-2 rounded-full ${
              currentPage === idx ? 'w-8 bg-primary-300' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </View>

      {/* Back / Next buttons */}
      <View className="absolute bottom-10 w-full flex-row justify-between px-8">
        <TouchableOpacity onPress={handleBack} disabled={currentPage === 0}>
          <Text
            className={`text-lg ${
              currentPage === 0 ? 'text-gray-300' : 'text-primary-300'
            }`}
          >
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext}>
          <Text className="text-lg text-primary-300">
            {currentPage === PAGES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Onboarding
