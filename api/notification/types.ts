export interface Notification {
    title: string
    body: string
    isRead: boolean
    groupId: string
    createdAt?: string // Optional for grouping, simulated if not returned
  }