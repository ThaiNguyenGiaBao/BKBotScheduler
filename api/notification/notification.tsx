import api from '..'
import { Notification } from './types'

export async function getNotifications(): Promise<Notification[]> {
  try {
    const response = await api.get<Notification[]>('/notifications')
    return response.data
  } catch (error) {
    console.error('Error fetching notifications:', error)
    throw error
  }
}
