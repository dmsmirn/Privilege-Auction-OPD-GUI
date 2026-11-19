import { useEffect, useState } from 'react'

interface Result<T> {
  tick: number
  data?: T
  error?: Error
}

// Загружает данные и умеет перезагружать их (reload).
// fn должна быть стабильной (функция из src/api или useCallback).
export function useFetch<T>(fn: () => Promise<T>) {
  const [tick, setTick] = useState(0)
  const [result, setResult] = useState<Result<T>>({ tick: -1 })

  useEffect(() => {
    let cancelled = false
    fn()
      .then((data) => {
        if (!cancelled) setResult({ tick, data })
      })
      .catch((error: Error) => {
        if (!cancelled) setResult({ tick, error })
      })
    return () => {
      cancelled = true
    }
  }, [fn, tick])

  return {
    data: result.data,
    error: result.tick === tick ? result.error : undefined,
    loading: result.tick !== tick && result.data === undefined,
    reload: () => setTick((t) => t + 1),
  }
}
