import api from '..'
import {
  ChatMessage,
  ChatResponse,
  ChatHistoryItem,
  DeleteMessageRequest,
} from './types'

/**
 * Gửi tin nhắn tới chatbot
 */
export const sendMessageToChatbot = async (
  message: ChatMessage
): Promise<ChatResponse> => {
  const res = await api.post<ChatResponse>('/chatbot', message)
  return res.data
}

/**
 * Lấy lịch sử tin nhắn chatbot
 */
export const getChatbotHistory = async (): Promise<ChatHistoryItem[]> => {
  const res = await api.get<ChatHistoryItem[]>('/chatbot')
  return res.data
}

/**
 * Xóa một tin nhắn cụ thể
 */
export const deleteChatMessage = async (
  data: DeleteMessageRequest
): Promise<void> => {
  await api.delete('/chatbot', { data })
}

/**
 * Xóa toàn bộ lịch sử trò chuyện
 */
export const deleteAllChatHistory = async (): Promise<void> => {
  await api.delete('/chatbot/all')
}

/**
 * Gửi test message đến dịch vụ LLM
 */
export const testLLMService = async (
  message: ChatMessage
): Promise<ChatResponse> => {
  const res = await api.post<ChatResponse>('/chatbot/test', message)
  return res.data
}
