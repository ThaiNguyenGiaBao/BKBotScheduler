import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import images from '@/constants/images'
import { Feather } from '@expo/vector-icons'

interface Member {
  id: string
  email: string
  name: string
}

interface MemberItemProps {
  member: Member
  onRemove?: () => void
}

export default function MemberItem({ member, onRemove }: MemberItemProps) {
  const shorten = (text: string, maxLength: number = 25) =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text

  return (
    <View style={styles.container}>
      <View style={styles.infoRow}>
        <Image source={images.avatar} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{shorten(member.name)}</Text>
          <Text style={styles.email}>{shorten(member.email)}</Text>
        </View>
      </View>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <Feather name="trash-2" size={20} color="#EA4335" />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  textContainer: {
    flexShrink: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#191D31',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#191D31',
  },
  removeButton: {
    marginLeft: 12,
    padding: 4,
  },
})
