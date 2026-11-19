import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../store/context'
import styles from './Layout.module.css'
import ErrorBoundary from './ErrorBoundary'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Главная', end: true },
  { to: '/tasks', label: 'Задачи' },
  { to: '/auction', label: 'Аукцион' },
  { to: '/demo', label: 'Демо' },
]

export default function Layout() {
  const { session, group } = useApp()
  const location = useLocation()
  return (
    <div>
      <header className={styles.header}>
        <NavLink to="/" className={styles.logo} aria-label="STATA — на главную">
          <Logo variant="mark" height={30} />
          <strong>STATA</strong>
        </NavLink>
        <nav className={styles.nav}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        {session && (
          <NavLink
            to="/me"
            className={({ isActive }) =>
              isActive ? `${styles.user} ${styles.userActive}` : styles.user
            }
            title="Профиль"
          >
            <span className={styles.userText}>
              <b>{session.name}</b>
              {group && <span>{group.name}</span>}
            </span>
            <span className={styles.avatar}>
              {session.name.slice(0, 1).toUpperCase()}
            </span>
          </NavLink>
        )}
      </header>
      <main className={styles.main}>
        <ErrorBoundary resetKey={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}
