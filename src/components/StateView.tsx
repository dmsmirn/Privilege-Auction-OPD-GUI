import type { ReactNode } from 'react'
import { ErrorMessage, Loader } from './ui'

interface StateViewProps {
  loading: boolean
  error?: Error
  onRetry: () => void
  children: ReactNode
}

// Показывает загрузку или ошибку вместо содержимого страницы
export default function StateView({
  loading,
  error,
  onRetry,
  children,
}: StateViewProps) {
  if (loading) return <Loader />
  if (error) return <ErrorMessage message={error.message} onRetry={onRetry} />
  return <>{children}</>
}
