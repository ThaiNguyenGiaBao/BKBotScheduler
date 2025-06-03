export interface ChatMessage {
    message: string
}
  
export interface ChatResponse {
    message: string
    data: any
    status: 'success' | 'error'
}
  
export interface ChatHistoryItem {
    id: string
    userId: string
    text: string
    textBot: string
    response: string
    createTime: string
    domain: string
    action: string
}
  
export interface DeleteMessageRequest {
    messageId: string
}
  