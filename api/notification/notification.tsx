import api from '..'
import { Notification } from './types'

type GroupResponse = {
  id: string
  name: string
}

export async function getNotifications(): Promise<
  (Notification & { groupName?: string })[]
> {
  try {
    const response = await api.get<Notification[]>('/notifications')
    const notifications = response.data

    // Extract unique groupIds
    const groupIds = [...new Set(notifications.map((n) => n.groupId))]

    // Fetch group names in parallel
    const groupMap: Record<string, string> = {}
    await Promise.all(
      groupIds.map(async (id) => {
        try {
          const res = await api.get<GroupResponse>(`/groups/${id}`)
          groupMap[id] = res.data.name
        } catch (err) {
          console.warn(`Failed to fetch group ${id}`, err)
          groupMap[id] = 'Unknown Group'
        }
      })
    )

    // Attach groupName to each notification
    const enriched = notifications.map((noti) => ({
      ...noti,
      groupName: groupMap[noti.groupId] || 'Unknown Group',
    }))

    return enriched
  } catch (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }
}

export async function toggleNotificationRead(
  id: string,
  isRead: boolean
): Promise<void> {
  try {
    await api.patch(`/notifications/${id}`, { isRead: !isRead })
  } catch (error) {
    console.error(`Failed to toggle read status for notification ${id}:`, error)
    throw error
  }
}
