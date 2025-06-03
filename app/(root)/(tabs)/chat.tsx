import React, { useEffect, useRef, useState } from 'react'

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
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native'
import Markdown from 'react-native-markdown-display'
import { Ionicons } from '@expo/vector-icons'
import TopBar from '@/component/topBar'
import icons from '@/constants/icons'
import {
  deleteAllChatHistory,
  getChatbotHistory,
  sendMessageToChatbot,
} from '@/api/chatbot/chatbot'
import icon from '@/assets/images/icon.png'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface MessageGroup {
  date: string
  messages: Message[]
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isBotTyping, setIsBotTyping] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  )
  const flatListRef = useRef<FlatList>(null)

  // Animation values for introduction
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const titleFadeAnim = useRef(new Animated.Value(0)).current
  const titleSlideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    if (messages.length === 0) {
      // Reset animation values
      fadeAnim.setValue(0)
      slideAnim.setValue(50)
      scaleAnim.setValue(0.8)
      titleFadeAnim.setValue(0)
      titleSlideAnim.setValue(30)

      // Define animation sequence
      const imageAnimation = Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ])

      const textAnimation = Animated.parallel([
        Animated.timing(titleFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleSlideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])

      // Create looping animation with staggered effect
      const loopAnimation = Animated.loop(
        Animated.sequence([
          imageAnimation,
          Animated.delay(200), // Stagger text animation
          textAnimation,
          Animated.delay(1000), // Pause before restarting loop
        ])
      )

      // Start the animation
      loopAnimation.start()

      // Cleanup: Stop the animation when component unmounts or messages change
      return () => loopAnimation.stop()
    }
  }, [messages.length])

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  // Start introduction animations when no messages
  useEffect(() => {
    if (messages.length === 0 && !loading) {
      // Reset animations
      fadeAnim.setValue(0)
      slideAnim.setValue(50)
      scaleAnim.setValue(0.8)
      titleFadeAnim.setValue(0)
      titleSlideAnim.setValue(30)

      // Staggered animation sequence
      const imageAnimation = Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ])

      const textAnimation = Animated.parallel([
        Animated.timing(titleFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleSlideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])

      // Start image animation first, then text after 400ms
      imageAnimation.start(() => {
        setTimeout(() => {
          textAnimation.start()
        }, 200)
      })
    }
  }, [messages.length, loading])

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]): MessageGroup[] => {
    const groups: { [key: string]: Message[] } = {}

    messages.forEach((message) => {
      const dateKey = message.timestamp.toDateString()
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })

    return Object.keys(groups)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((date) => ({
        date,
        messages: groups[date],
      }))
  }

  // Format date for display
  const formatDateHeader = (dateString: string): string => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
  }

  // Format time for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const history = await getChatbotHistory()
      const formattedMessages: Message[] = history.reverse().flatMap((item) => [
        {
          id: item.id + '_user',
          text: item.text,
          sender: 'user',
          timestamp: new Date(item.createTime || Date.now()), // Assuming API returns createdAt
        },
        {
          id: item.id + '_bot',
          text: item.response,
          sender: 'bot',
          timestamp: new Date(item.createTime || Date.now()),
        },
      ])
      setMessages(formattedMessages)
    } catch (error) {
      Alert.alert('Error', 'Cannot load chat history.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleSend = async () => {
    if (!inputText.trim()) return

    const now = new Date()
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: now,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setIsBotTyping(true)

    try {
      const res = await sendMessageToChatbot({ message: userMessage.text })
      const botMessage: Message = {
        id: Date.now().toString() + '_bot',
        text:
          res.message ??
          'Đã thêm sự kiện. Vui lòng kiểm tra trên Google Calendar.',
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      Alert.alert('Error', 'Cannot send message.')
    } finally {
      setIsBotTyping(false)
    }
  }

  const handleClearChat = async () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete all chat history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true)
              await deleteAllChatHistory()
              setMessages([])
              // Reset animation values
              fadeAnim.setValue(0)
              slideAnim.setValue(50)
              scaleAnim.setValue(0.8)
              titleFadeAnim.setValue(0)
              titleSlideAnim.setValue(30)
              Alert.alert('Successful', 'Deleted all chat history.')
            } catch (error) {
              Alert.alert('Error', 'Cannot delete chat history.')
            } finally {
              setDeleting(false)
            }
          },
        },
      ]
    )
  }

  const handleMessagePress = (messageId: string) => {
    setSelectedMessageId(selectedMessageId === messageId ? null : messageId)
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user'
    const isSelected = selectedMessageId === item.id

    return (
      <View style={{ marginVertical: 6 }}>
        <TouchableOpacity
          onPress={() => handleMessagePress(item.id)}
          activeOpacity={0.7}
        >
          <View
            style={{
              flexDirection: isUser ? 'row-reverse' : 'row',
              alignItems: 'center',
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
              {isUser ? (
                <Text selectable={true} style={{ color: '#fff', fontSize: 14 }}>
                  {item.text}
                </Text>
              ) : (
                <Markdown
                  style={{
                    body: { color: '#fff', fontSize: 14 },
                    strong: { fontWeight: 'bold' },
                    em: { fontStyle: 'italic' },
                    heading1: { fontSize: 18, fontWeight: 'bold' },
                    heading2: { fontSize: 16, fontWeight: 'bold' },
                    code_inline: {
                      backgroundColor: '#8C8E98',
                      color: '#fff',
                      paddingHorizontal: 4,
                      paddingVertical: 2,
                      borderRadius: 4,
                      fontFamily:
                        Platform.OS === 'ios' ? 'Courier' : 'monospace',
                    },
                  }}
                >
                  {item.text}
                </Markdown>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Show timestamp when message is selected */}
        {isSelected && (
          <View
            style={{
              alignItems: isUser ? 'flex-end' : 'flex-start',
              marginTop: 4,
              marginHorizontal: isUser ? 62 : 62, // Account for avatar width + margin
            }}
          >
            <Text
              style={{ fontSize: 12, color: isUser ? '#0061FF' : '#8C8E98' }}
            >
              {formatTime(item.timestamp)}
            </Text>
          </View>
        )}
      </View>
    )
  }

  const renderDateHeader = (date: string) => (
    <View
      style={{
        alignItems: 'center',
        marginVertical: 16,
      }}
    >
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 12, color: '#666876', fontWeight: '500' }}>
          {formatDateHeader(date)}
        </Text>
      </View>
    </View>
  )

  const renderGroupedMessages = () => {
    const messageGroups = groupMessagesByDate(messages)

    return (
      <FlatList
        ref={flatListRef}
        data={messageGroups}
        keyExtractor={(item) => item.date}
        renderItem={({ item: group }) => (
          <View>
            {renderDateHeader(group.date)}
            {group.messages.map((message: Message) => (
              <View key={message.id}>{renderMessage({ item: message })}</View>
            ))}
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopBar
        title="Chatbot"
        rightIcon={
          deleting ? (
            <ActivityIndicator
              size="small"
              color="#000"
              style={{ marginRight: 12 }}
            />
          ) : (
            <TouchableOpacity onPress={handleClearChat}>
              <Ionicons
                name="trash-outline"
                size={24}
                color="#000"
                style={{ marginRight: 12 }}
              />
            </TouchableOpacity>
          )
        }
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" color="#0061FF" />
            <Text style={{ marginTop: 12, color: '#888' }}>
              Loading chatbot...
            </Text>
          </View>
        ) : messages.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24,
            }}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              }}
            >
              <Image
                source={icon}
                style={{
                  width: 100,
                  height: 100,
                  marginBottom: 20,
                  borderColor: '#0061FF',
                  borderRadius: 999,
                  borderWidth: 3,
                }}
                resizeMode="contain"
              />
            </Animated.View>
            <Animated.View
              style={{
                opacity: titleFadeAnim,
                transform: [{ translateY: titleSlideAnim }],
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#191D31',
                  textAlign: 'center',
                }}
              >
                Welcome to BKBotScheduler 👋
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#0061FF',
                  textAlign: 'center',
                  marginTop: 8,
                }}
              >
                Ask me to add events, check your schedule, or suggest study
                plans!
              </Text>
            </Animated.View>
          </View>
        ) : (
          renderGroupedMessages()
        )}

        <View
          style={{
            flexDirection: 'row',
            padding: 12,
            backgroundColor: '#fff',
          }}
        >
          <TextInput
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#666876',
              color: '#666876',
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 8,
              fontSize: 14,
            }}
            multiline
            numberOfLines={4}
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
            {isBotTyping ? (
              <ActivityIndicator size={20} color="#ccc" />
            ) : (
              <Ionicons name="send" size={24} color="#2979FF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatScreen
