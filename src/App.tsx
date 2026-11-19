import { Route, Routes } from 'react-router-dom'
import { RequireAuth, RequireGroup } from './components/Guards'
import Layout from './components/Layout'
import AuctionPage from './pages/AuctionPage'
import DemoPage from './pages/DemoPage'
import GroupsPage from './pages/GroupsPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'
import TaskDetailPage from './pages/TaskDetailPage'
import TasksPage from './pages/TasksPage'

// Порядок экранов повторяет блок-схемы:
// вход/регистрация → есть группа? (выбор/создание) → главная → задачи → аукцион
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/groups" element={<GroupsPage />} />
          <Route element={<RequireGroup />}>
            <Route index element={<HomePage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/:id" element={<TaskDetailPage />} />
            <Route path="/auction" element={<AuctionPage />} />
            <Route path="/me" element={<ProfilePage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
