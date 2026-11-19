import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AppContext, type AppActions, type AppState } from './context'

const KEY = 'stata-app-state'
const EMPTY: AppState = { myTasks: {}, flags: {}, forceMajeure: {} }

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<AppState>) } : EMPTY
  } catch {
    return EMPTY
  }
}

export default function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      // хранилище недоступно (приватный режим) — работаем без сохранения
    }
  }, [state])

  const actions = useMemo<AppActions>(
    () => ({
      login: (session) => setState((s) => ({ ...s, session })),
      logout: () => setState(EMPTY),
      setGroup: (group) => setState((s) => ({ ...s, group })),
      takeTask: (id) =>
        setState((s) => ({
          ...s,
          myTasks: { ...s.myTasks, [id]: 'in_progress' },
        })),
      submitTask: (id) =>
        setState((s) => ({ ...s, myTasks: { ...s.myTasks, [id]: 'review' } })),
      askHelp: (id) =>
        setState((s) => ({ ...s, flags: { ...s.flags, [id]: 'help' } })),
      sendForceMajeure: (id, reason) =>
        setState((s) => ({
          ...s,
          forceMajeure: { ...s.forceMajeure, [id]: reason },
        })),
      acceptTask: (id) =>
        setState((s) => ({ ...s, myTasks: { ...s.myTasks, [id]: 'done' } })),
      // Схема «Форс-мажор»: одобрено — задача становится «горящей» и уходит в ленту,
      // не одобрено — возвращается к тому же участнику
      resolveForceMajeure: (id, approved) =>
        setState((s) => {
          const forceMajeure = { ...s.forceMajeure }
          delete forceMajeure[id]
          if (!approved) return { ...s, forceMajeure }
          const myTasks = { ...s.myTasks }
          delete myTasks[id]
          return {
            ...s,
            forceMajeure,
            myTasks,
            flags: { ...s.flags, [id]: 'hot' },
          }
        }),
    }),
    [],
  )

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
