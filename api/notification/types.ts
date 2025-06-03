export interface Notification {
    title: string
    body: string
    isRead: boolean
    groupId: string
    createTime?: string // Optional for grouping, simulated if not returned
    groupName?: string
  }