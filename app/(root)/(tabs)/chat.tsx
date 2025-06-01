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

    // Simulate bot "thinking"
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
            maxWidth: '80%',
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
    <KeyboardAvoidingView
    className='p-3'
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <TopBar title="Chatbot" />

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{  paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: 'row',
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderColor: '#eee',
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: '#F1F1F1',
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
            color={isBotTyping ? '#ccc' : '#2979FF'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default ChatScreen
