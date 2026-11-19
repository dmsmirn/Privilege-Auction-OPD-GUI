import type { Lot, PriceInput, Task, User } from '../types'
import { request } from './client'

export const getTasks = () => request<Task[]>('/api/tasks')
export const getTask = (id: string) =>
  request<Task>(`/api/tasks/${encodeURIComponent(id)}`)
export const getLots = () => request<Lot[]>('/api/lots')
export const getMe = () => request<User>('/api/me')

export const placeBid = (lotId: string, amount: number) =>
  request<Lot>(`/api/lots/${encodeURIComponent(lotId)}/bids`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
  })

export const previewPrice = (input: PriceInput) =>
  request<{ price: number }>('/api/price/preview', {
    method: 'POST',
    body: JSON.stringify(input),
  })

export { ApiError } from './client'
