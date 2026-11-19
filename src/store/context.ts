import { createContext, useContext } from 'react'
import type { TaskStatus } from '../types'

// Данные, которых пока нет на сервере (вход, группы, помощь, форс-мажор).
// Хранятся в браузере. Когда API их добавит, эти места заменим запросами.

export interface Session {
  name: string
  email: string
}

export interface Group {
  id: string
  name: string
  code: string
  members: number
  isAdmin: boolean
}

export type TaskFlag = 'help' | 'hot'
export type LocalStatus = Extract<TaskStatus, 'in_progress' | 'done'> | 'review'

export interface AppState {
  session?: Session
  group?: Group
  // задачи, которые взял текущий пользователь
  myTasks: Record<string, LocalStatus>
  // отметки в ленте: «нужна помощь» / «горящая задача»
  flags: Record<string, TaskFlag>
  // причины форс-мажора, отправленные админу
  forceMajeure: Record<string, string>
}

export interface AppActions {
  login: (s: Session) => void
  logout: () => void
  setGroup: (g: Group | undefined) => void
  takeTask: (id: string) => void
  submitTask: (id: string) => void
  askHelp: (id: string) => void
  sendForceMajeure: (id: string, reason: string) => void
  // действия админа
  acceptTask: (id: string) => void
  resolveForceMajeure: (id: string, approved: boolean) => void
}

export const AppContext = createContext<(AppState & AppActions) | null>(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp должен использоваться внутри AppProvider')
  return ctx
}
