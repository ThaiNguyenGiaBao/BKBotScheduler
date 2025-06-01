import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import FilterList from '@/component/filterList'
import Search from '@/component/search'
import { SafeAreaView } from 'react-native-safe-area-context'
import RecommendationItem from '@/component/recommendationItem'
import images from '@/constants/images'
import icons from '@/constants/icons'
import TopBar from '@/component/topBar'

const Explore = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <TopBar title="Groups" />
      <ScrollView className="p-3" showsHorizontalScrollIndicator={false}>
        <View className="flex flex-row justify-between items-center">
          <Text>Group Screen</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Explore

