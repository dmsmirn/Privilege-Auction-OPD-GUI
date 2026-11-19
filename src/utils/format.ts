import type { TaskRank } from '../types'

const CURRENCY = 'баллов'

export function formatMoney(value: number): string {
  return `${value.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ${CURRENCY}`
}

export function formatNumber(value: number): string {
  return value.toLocaleString('ru-RU', { maximumFractionDigits: 2 })
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function isPast(iso: string): boolean {
  return new Date(iso).getTime() <= Date.now()
}

// «осталось 3 дн.», «осталось 5 ч.», «осталось 12 мин.»
export function timeLeft(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now()
  if (ms <= 0) return 'торги закончены'
  const min = Math.floor(ms / 60000)
  if (min < 60) return `осталось ${Math.max(min, 1)} мин.`
  const h = Math.floor(min / 60)
  if (h < 48) return `осталось ${h} ч.`
  return `осталось ${Math.floor(h / 24)} дн.`
}

export const STATUS_LABEL = {
  open: 'Открыта',
  in_progress: 'В работе',
  review: 'На проверке',
  done: 'Выполнена',
} as const

export type ViewStatus = keyof typeof STATUS_LABEL

// Статус с учётом действий пользователя (взял задачу, сдал на проверку)
export function viewStatus(
  task: { id: string; status: ViewStatus },
  myTasks: Record<string, ViewStatus>,
): ViewStatus {
  return myTasks[task.id] ?? task.status
}

// Ранги задач из библиотеки pa::Engine: множитель M и диапазон базовой цены
export const RANKS: Record<
  TaskRank,
  { m: number; title: string; range: string }
> = {
  D: { m: 1, title: 'Бытовая', range: 'до 50' },
  C: { m: 3, title: 'Средняя', range: '51–200' },
  B: { m: 5, title: 'Высокая', range: '201–500' },
  A: { m: 10, title: 'Эпическая', range: 'от 501' },
}

// Безопасно: если сервер не прислал ранг (старая версия), считаем его D
export function rankInfo(rank: TaskRank | undefined) {
  const key: TaskRank = rank && rank in RANKS ? rank : 'D'
  return { key, ...RANKS[key] }
}
