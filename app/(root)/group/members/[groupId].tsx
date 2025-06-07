// File: app/group/members/[groupId].tsx

import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import TopBar from '@/component/topBar'
import images from '@/constants/images'
import api from '@/api'
import MemberItem from '@/component/memberItem'

interface Member {
  id: string
  email: string
  name: string
}

interface Group {
  id: string
  name: string
  description: string
}

export default function GroupMembers() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingGroup, setIsLoadingGroup] = useState(true)
  const [members, setMembers] = useState<Member[]>([])
  const [group, setGroup] = useState<Group | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [err, setErr] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  // Fetch group info
  useEffect(() => {
    if (!groupId) return
    const fetchGroup = async () => {
      setIsLoadingGroup(true)
      try {
        const res = await api.get(`/groups/${groupId}`)
        setGroup(res.data)
      } catch (error) {
        console.error('Failed to fetch group:', error)
        setGroup(null)
      } finally {
        setIsLoadingGroup(false)
      }
    }
    fetchGroup()
  }, [groupId])

  // Fetch members
  useEffect(() => {
    if (!groupId) return
    const fetchMembers = async () => {
      setIsLoading(true)
      try {
        const res = await api.get(`/groups/${groupId}/members`)
        setMembers(res.data.users || [])
      } catch (error) {
        console.error('Failed to fetch members:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMembers()
  }, [groupId])

  // Add member
  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      setErr('Please enter a valid email address.')
      return
    }
    if (isPosting) return

    setIsPosting(true)
    setErr('')
    try {
      const res = await api.post(`/groups/${groupId}/members`, {
        email: newMemberEmail,
      })
      setMembers((prev) => [...prev, res.data])
      setNewMemberEmail('')
      setModalVisible(false)
    } catch (error: any) {
      console.error('Add member failed:', error)
      setErr(error.response?.data?.message || 'Failed to add member')
    } finally {
      setIsPosting(false)
    }
  }

  // Remove member by email
  const handleRemoveMember = async (email: string) => {
    try {
      await api.delete(
        `/groups/${groupId}/members/${encodeURIComponent(email)}`
      )
      setMembers((prev) => prev.filter((m) => m.email !== email))
    } catch (error) {
      console.error('Remove member failed:', error)
    }
  }

  const renderGroupHeader = () => {
    if (isLoadingGroup) {
      return (
        <View style={styles.groupHeaderContainer}>
          <View style={styles.skelAvatar} />
          <View style={styles.groupInfoContainer}>
            <View style={styles.skelLineShort} />
            <View style={styles.skelLineTiny} />
          </View>
        </View>
      )
    }

    if (!group) {
      return (
        <View style={styles.groupHeaderContainer}>
          <Image source={images.onboarding1} style={styles.avatar} />
          <View style={styles.groupInfoContainer}>
            <Text style={styles.notFoundTitle}>Group not found</Text>
            <Text style={styles.notFoundSub}>Unable to load group info</Text>
          </View>
        </View>
      )
    }

    return (
      <View style={styles.groupHeaderContainer}>
        <Image source={images.onboarding1} style={styles.avatar} />
        <View style={styles.groupInfoContainer}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.tasksRemaining}>
            {members.length} member{members.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title="Group Members" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {renderGroupHeader()}

        <Text style={styles.membersTitle}>Members</Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading members...</Text>
          </View>
        ) : (
          <>
            {members.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Image source={images.onboarding2} style={styles.emptyImage} />
                <Text style={styles.emptyTitle}>No members yet</Text>
                <Text style={styles.emptySub}>
                  Invite members to collaborate in this group
                </Text>
              </View>
            ) : (
              members.map((member) => (
                <MemberItem
                  key={member.id}
                  member={member}
                  onRemove={() => handleRemoveMember(member.email)}
                />
              ))
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addButtonText}>Add new member</Text>
              <Ionicons name="person-add" size={20} color="#0061FF" />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Add Member Modal */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
              >
                <ScrollView
                  contentContainerStyle={styles.modalScroll}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.modalCard}>
                    <Text style={styles.modalTitle}>Add New Member</Text>
                    <TouchableOpacity
                      style={styles.modalClose}
                      onPress={() => {
                        setModalVisible(false)
                        setErr('')
                        setNewMemberEmail('')
                      }}
                    >
                      <MaterialCommunityIcons
                        name="close-circle-outline"
                        size={28}
                        color="#666876"
                      />
                    </TouchableOpacity>

                    {/* Placeholder illustration */}
                    <View style={styles.modalImageWrap}>
                      <Image
                        source={images.onboarding2}
                        style={styles.modalImage}
                        resizeMode="contain"
                      />
                    </View>

                    <TextInput
                      placeholder="New Member Email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={newMemberEmail}
                      onChangeText={(text) => {
                        setNewMemberEmail(text)
                        setErr('') // Clear error when user types
                      }}
                      style={[styles.input, err && styles.inputError]}
                    />
                    {err ? <Text style={styles.errorText}>{err}</Text> : null}

                    <TouchableOpacity
                      onPress={handleAddMember}
                      style={[
                        styles.modalSubmit,
                        isPosting && { opacity: 0.5 },
                      ]}
                      disabled={isPosting}
                    >
                      {isPosting ? (
                        <ActivityIndicator size="small" color="#0061FF" />
                      ) : (
                        <Text style={styles.modalSubmitText}>Save</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

  // Group Header Styles
  groupHeaderContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 40,
    marginBottom: 12,
  },
  groupInfoContainer: {
    alignItems: 'center',
  },
  groupName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
  },
  tasksRemaining: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  // Skeleton Loading Styles
  skelAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEE',
    marginBottom: 12,
  },
  skelLineShort: {
    width: 120,
    height: 20,
    backgroundColor: '#EEE',
    borderRadius: 4,
    marginBottom: 8,
  },
  skelLineTiny: {
    width: 80,
    height: 16,
    backgroundColor: '#EEE',
    borderRadius: 4,
  },

  // Error States
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888',
    textAlign: 'center',
  },
  notFoundSub: {
    color: '#AAA',
    textAlign: 'center',
    marginTop: 4,
  },

  // Members Section
  membersTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },

  loadingContainer: { alignItems: 'center', marginTop: 40 },
  loadingText: { marginTop: 12, color: '#666' },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyImage: { width: 120, height: 120, opacity: 0.5, marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '500', color: '#555' },
  emptySub: { fontSize: 14, color: '#888', textAlign: 'center' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D6E4FF',
    padding: 12,
    borderRadius: 24,
    marginTop: 24,
  },
  addButtonText: {
    color: '#0061FF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalScroll: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#191D31',
    textAlign: 'center',
  },
  modalClose: { position: 'absolute', top: 25, right: 15, zIndex: 1 },
  modalImageWrap: { alignItems: 'center', marginBottom: 20 },
  modalImage: { width: 250, height: 180, borderRadius: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  inputError: {
    borderColor: '#D9534F',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: '#D9534F',
    marginBottom: 8,
    fontSize: 14,
  },
  modalSubmit: {
    backgroundColor: '#0061FF1A',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalSubmitText: { color: '#0061FF', fontSize: 16, fontWeight: '600' },
})
