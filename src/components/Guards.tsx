import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../store/context'

// Схема «Авторизация»: без входа — на окно входа/регистрации
export function RequireAuth() {
  const { session } = useApp()
  const location = useLocation()
  if (!session)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

// Схема «Авторизация»: «есть группа?» нет — создание или выбор группы
export function RequireGroup() {
  const { group } = useApp()
  if (!group) return <Navigate to="/groups" replace />
  return <Outlet />
}
