import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { Button, Input } from '../components/ui'
import { useApp } from '../store/context'
import styles from './LoginPage.module.css'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const { login } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string>()

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return setError('Введите почту')
    if (password.length < 4) return setError('Пароль — минимум 4 символа')
    if (mode === 'register' && !name.trim()) return setError('Как вас зовут?')
    login({ name: name.trim() || email.split('@')[0], email })
    const from = (location.state as { from?: string } | null)?.from
    navigate(from && from !== '/login' ? from : '/', { replace: true })
  }

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <Logo height={120} />
        <h1 className={styles.title}>
          Жизнь — это игра.
          <br />
          Будь игроком.
        </h1>
        <p className="muted">
          Выполняйте задачи, копите баллы и выигрывайте привилегии на аукционе.
        </p>

        <div className={styles.tabs} role="tablist">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              className={
                mode === m ? `${styles.tab} ${styles.tabActive}` : styles.tab
              }
              onClick={() => {
                setMode(m)
                setError(undefined)
              }}
            >
              {m === 'login' ? 'Вход' : 'Регистрация'}
            </button>
          ))}
        </div>

        <form className={styles.form} onSubmit={submit} noValidate>
          {mode === 'register' && (
            <Input
              label="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          )}
          <Input
            label="Почта"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={
              mode === 'login' ? 'current-password' : 'new-password'
            }
            error={error}
          />
          <Button type="submit">
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </form>
        <p className={`muted ${styles.note}`}>
          Демо-версия: вход работает без сервера.
        </p>
      </div>
    </div>
  )
}
