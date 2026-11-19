// Типы данных строго по контракту API (docs/api.md)

export type TaskStatus = 'open' | 'in_progress' | 'done'

// Ранг задачи, как pa::TaskRank в библиотеке
export type TaskRank = 'D' | 'C' | 'B' | 'A'

export interface Task {
  id: string
  title: string
  description: string
  basePrice: number
  rank: TaskRank
  k1: number
  k2: number
  k3: number
  price: number
  status: TaskStatus
  createdAt: string
}

export interface Bid {
  userId: string
  amount: number
  createdAt: string
}

export interface Lot {
  id: string
  title: string
  currentBid: number
  endsAt: string
  bids: Bid[]
}

export interface User {
  id: string
  balance: number
  workload: number
  name?: string
}

export interface PriceInput {
  basePrice: number
  rank: TaskRank
  k1: number
  k2: number
  k3: number
}
