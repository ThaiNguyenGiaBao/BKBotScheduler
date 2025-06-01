import React, { useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const { width } = Dimensions.get('window')

const carouselItems = [
  'Manage your time with BKBotScheduler!',
  'Event planning is easy and fast',
  'Automate effective deadline management',
  'Explore BKBotScheduler with AI',
]

const Carousel = () => {
  const scrollRef = useRef<ScrollView>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (index + 1) % carouselItems.length
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true })
      setIndex(nextIndex)
    }, 3000)

    return () => clearInterval(interval)
  }, [index])

  return (
    <View style={styles.carouselWrapper}>
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ paddingHorizontal: -32 }}
      >
        {carouselItems.map((text, i) => {
          const isEven = i % 2 === 0
          const colors = isEven
            ? (['#0061FF', '#BA58B3'] as const)
            : (['#BA58B3', '#0061FF'] as const)

          return (
            <View key={i} style={{ width }}>
              <LinearGradient colors={colors} style={styles.slide}>
                <Text style={styles.slideText}>{text}</Text>
              </LinearGradient>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  carouselWrapper: {
    marginBottom: 24,
  },
  slide: {
    borderRadius: 25,
    padding: 24,
    height: 128,
    justifyContent: 'center',
    width: width - 32,
  },
  slideText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default Carousel
