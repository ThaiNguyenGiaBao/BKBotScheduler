// Explore.tsx
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import GroupItem from '@/component/groupitem' // your own component
import images from '@/constants/images' // your own asset map
import TopBar from '@/component/topBar'

import api from '@/api'
import { Group } from '@/types'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const Explore: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [err, setErr] = useState({
    name: '',
    description: '',
  })

  const [modalVisible, setModalVisible] = useState(false)

  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const handleCreateGroup = () => {
    // Simple validation: must have at least a title
    if (newTitle.trim().length === 0) {
      // You can show an Alert or set an error message, etc.
      setErr((prev) => ({ ...prev, name: 'Group name is required.' }))
      return
    }
    if (newDescription.trim().length === 0) {
      // Optional description, so no error here
      setErr((prev) => ({ ...prev, description: 'Description is required' }))
      return
    }

    // Create a new group object
    const newGroup: Group = {
      id: Date.now().toString(),
      name: newTitle.trim(),
      numMember: 1,
      description: newDescription.trim() || '', // optional description
    }

    // Call your API to create the group
    api
      .post('/groups', newGroup)
      .then((response) => {
        console.log('Group created successfully:', response.data)
      })
      .catch((error) => {
        console.error('Failed to create group:', error)
      })

    // Add to the front (or end) of array
    setGroups((prev) => [newGroup, ...prev])

    // Reset inputs & close modal
    setNewTitle('')
    setNewDescription('')
    setModalVisible(false)
  }

  // fetch groups from API on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/groups') // Adjust endpoint as needed
        setGroups(response.data.groups || [])
      } catch (error) {
        console.error('Failed to fetch groups:', error)
        setGroups([]) // Ensure groups is empty on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroups()
  }, [])

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center mt-20">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 text-gray-600 font-rubik-medium">
            Loading groups...
          </Text>
        </View>
      )
    }

    if (groups.length === 0) {
      return (
        <View className="flex-1 justify-center items-center mt-20">
          <Image
            resizeMode="contain"
            source={images.onboarding3}
            style={{ width: 200, height: 200, opacity: 0.5 }}
          />
          <Text className="text-gray-500 font-rubik-medium text-lg mt-4 text-center">
            You have no groups
          </Text>
          <Text className="text-gray-400 font-rubik-regular text-sm mt-2 text-center px-8">
            Create your first group to start collaborating with others
          </Text>
        </View>
      )
    }

    return (
      <View className="mt-5 space-y-3">
        {groups.map((g) => (
          <GroupItem
            key={g.id}
            groupId={g.id}
            title={g.name}
            members={g.numMember}
            description={g.description}
            imageSrc={images.onboarding3}
          />
        ))}
      </View>
    )
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <TopBar title="Group" />
      <ScrollView
        className="p-3"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* ───────────────────────────────── Header ───────────────────────────────── */}

        <View className="mt-3" />

        {renderContent()}
        {isLoading == false && (
          <View className="mt-5 items-center mb-8">
            <TouchableOpacity
              className="bg-blue-500 rounded-full w-14 h-14 items-center justify-center"
              onPress={() => setModalVisible(true)}
            >
              <Text className="text-white text-3xl">+</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ───────────────────────────────── Create Group Modal ───────────────────────────────── */}
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-center items-center bg-black/30"
        >
          <View className="bg-white w-11/12 mx-2 rounded-2xl p-5">
            <View className="relative mb-4 items-center justify-center">
              <Text className="text-2xl font-bold">Create Group</Text>
              <TouchableOpacity
                className="absolute right-0"
                onPress={() => setModalVisible(false)}
              >
                <MaterialCommunityIcons
                  name="close-circle-outline"
                  size={28}
                  color="#666876"
                />
              </TouchableOpacity>
            </View>

            {/* Title */}

            {/* Placeholder image (replace with your own or let user upload) */}
            <View className="items-center mb-4">
              <Image
                resizeMode="contain"
                source={images.onboarding2 /* your illustration asset */}
                style={{ width: 300, height: 250 }}
              />
            </View>

            {/* Input: Group Name */}
            <TextInput
              placeholder="Group Name"
              value={newTitle}
              onChangeText={setNewTitle}
              className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
            />
            {err.name && <Text className="text-red-500 mb-2">{err.name}</Text>}

            {/* Input: Group Description (optional) */}
            <TextInput
              placeholder="Description"
              value={newDescription}
              onChangeText={setNewDescription}
              className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
              multiline
              numberOfLines={2}
            />

            {err.description && (
              <Text className="text-red-500 mb-2">{err.description}</Text>
            )}

            {/* Save Button */}
            <TouchableOpacity
              className="bg-blue-500 rounded-full py-3 items-center"
              onPress={handleCreateGroup}
            >
              <Text className="text-white font-rubik-medium text-base">
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  )
}

export default Explore
