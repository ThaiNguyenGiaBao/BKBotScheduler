import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
  Platform,
  Image,
  SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TopBar from '@/component/topBar'
import icons from '@/constants/icons'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Tôi cần hoàn thành bài tập lớn CNPM trước 11 giờ tối',
      sender: 'user',
    },
    {
      id: '2',
      text: 'Đã thêm nhiệm vụ “Hoàn thành bài tập lớn CNPM”, deadline 11pm',
      sender: 'bot',
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isBotTyping, setIsBotTyping] = useState(false)

  const handleSend = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setIsBotTyping(true)

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Đã thêm nhiệm vụ “Hoàn thành bài tập lớn CNPM”, deadline 11pm',
        sender: 'bot',
      }
      setMessages((prev) => [...prev, botResponse])
      setIsBotTyping(false)
    }, 2000)
  }

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user'

    return (
      <View
        style={{
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'center',
          marginVertical: 6,
        }}
      >
        {isUser ? (
          <Ionicons
            name="person-circle-outline"
            size={50}
            color="#000"
            style={{ marginLeft: 8, marginRight: 4 }}
          />
        ) : (
          <Image
            source={icons.chatbot}
            style={{
              width: 50,
              height: 50,
              marginRight: 8,
              marginLeft: 4,
              borderRadius: 150,
            }}
            resizeMode="contain"
          />
        )}

        <View
          style={{
            backgroundColor: isUser ? '#0061FF' : '#8C8E98',
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 16,
            borderTopRightRadius: isUser ? 0 : 16,
            borderTopLeftRadius: isUser ? 16 : 0,
            maxWidth: '75%',
          }}
        >
          <Text style={{ color: isUser ? '#fff' : '#fff', fontSize: 14 }}>
            {item.text}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopBar title="Chatbot" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>

      <View
        style={{
          flexDirection: 'row',
          padding: 12,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderColor: '#eee',
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '666876',
            color: '#666876',
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 8,
            fontSize: 14,
          }}
          placeholder="Chat here"
          value={inputText}
          onChangeText={setInputText}
          editable={!isBotTyping}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={isBotTyping}
          style={{ marginLeft: 8, justifyContent: 'center' }}
        >
          <Ionicons
            name="send"
            size={24}
            color={isBotTyping ? '#0061FF' : '#2979FF'}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ChatScreen
