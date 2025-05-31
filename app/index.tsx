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
import images from '@/constants/images'
import icons from '@/constants/icons'
import { router, Router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ChatBotIcon from '@/component/chatbotIcon'

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
    image: images.onboarding4, // <-- your final image
    subtitle: '',
    title: 'The Future Of Scheduling Starts Here.',
    description: '',
    showGoogleSignIn: true, // <-- flag to render the Google button
  },
]

const Onboarding = ({}) => {
  const scrollRef = useRef<ScrollView>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(true)

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding')
      if (hasSeenOnboarding) {
        setIsOnboardingVisible(false)
        router.replace('/(root)/(tabs)/home') // Navigate to home
      }
    }
    checkOnboardingStatus()
  }, [])

  const handleScroll = (e) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width)
    setCurrentPage(page)
  }

  // inside your Onboarding component:
  const handleNext = async () => {
    if (currentPage < PAGES.length - 1) {
      scrollRef.current?.scrollTo({
        x: (currentPage + 1) * width,
        animated: true,
      })
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true') // Save flag
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
    return null // Don't render onboarding if already seen
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

            <View className="flex-1 items-center ">
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
                <TouchableOpacity className="shadow-md rounded-3xl bg-white p-3 mt-6 w-5/6">
                  <View className="flex-row items-center justify-center">
                    <Image
                      source={icons.google}
                      style={{ width: 20, height: 20 }}
                    />
                    <Text className="font-rubik-medium ml-2 text-lg">
                      Sign in with Google
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* page indicator */}
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

      {/* Back / Next */}
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
