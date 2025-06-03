// app/(root)/(tabs)/profile.tsx
import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import images from '@/constants/images'
import { Ionicons } from '@expo/vector-icons'
import TopBar from '@/component/topBar'

const Profile = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <TopBar title="Profile" />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Avatar */}
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <Image
            source={images.avatar}
            style={{ width: 120, height: 120, borderRadius: 60 }}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 0,
              right: (120 - 30) / -2,
              backgroundColor: '#2979FF',
              borderRadius: 999,
              padding: 6,
            }}
          >
            <Ionicons name="create-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
              PingPongBKD
            </Text>
            <Ionicons
              name="pencil"
              size={16}
              color="#000"
              style={{ marginLeft: 6 }}
            />
          </View>
          <Text style={{ color: '#666', marginTop: 4 }}>
            pingpongbkd@hcmut.edu.vn
          </Text>
        </View>

        {/* Actions */}
        <View style={{ marginTop: 32, gap: 16 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#1A1A2E',
              paddingVertical: 14,
              borderRadius: 30,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              Toggle dark mode
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#FFE0E0',
              paddingVertical: 14,
              borderRadius: 30,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'red', fontWeight: 'bold' }}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
