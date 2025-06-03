// app/(root)/(tabs)/_layout.tsx
import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import icons from '@/constants/icons'

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean
  icon: any
  title: string
}) => {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          width: 24,
          height: 24,
          tintColor: focused ? '#0061ff' : '#666876',
        }}
      />
      <Text
        style={{
          fontSize: 10,
          color: focused ? '#0061ff' : '#666876',
          fontWeight: focused ? '800' : '500',
          lineHeight: 16,
        }}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  )
}

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          minHeight: 70,
          backgroundColor: 'white',
        },
        tabBarItemStyle: {
          flex: 1,
          height: 70,
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarIconStyle: {
          flex: 1,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="group/index"
        options={{
          title: 'Group',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Group" />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.chat} title={'Chat'} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title={'Profile'} />
          ),
        }}
      />
    </Tabs>
  )
}

export default TabLayout
