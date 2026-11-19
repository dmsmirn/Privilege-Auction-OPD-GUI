import { Link, useNavigate } from 'react-router-dom'
import { getMe } from '../api'
import StateView from '../components/StateView'
import { Badge, Button, Card } from '../components/ui'
import { useFetch } from '../hooks/useFetch'
import { useApp } from '../store/context'
import { formatMoney, formatNumber } from '../utils/format'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { data: user, error, loading, reload } = useFetch(getMe)
  const { session, group, myTasks, logout } = useApp()
  const navigate = useNavigate()
  const done = Object.values(myTasks).filter((s) => s === 'done').length
  const inWork = Object.values(myTasks).filter(
    (s) => s === 'in_progress' || s === 'review',
  ).length

  return (
    <>
      <h1>Профиль</h1>
      <p className="page-lead">Баланс, загрузка и ваша группа.</p>

      <div className={styles.layout}>
        <Card className={styles.who}>
          <div className={styles.avatar}>
            {(session?.name ?? '?').slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h2 className={styles.name}>{session?.name}</h2>
            <span className="muted">{session?.email}</span>
          </div>
        </Card>
        <Card>
          <div className="muted">Группа</div>
          <div className={styles.group}>
            <b>{group?.name}</b>{' '}
            {group?.isAdmin && <Badge tone="solid">Админ</Badge>}
          </div>
          <div className="muted">Код: {group?.code}</div>
          <Link to="/groups">Сменить группу</Link>
        </Card>
        <Card>
          <div className="muted">Мои задачи</div>
          <div className={styles.big}>{inWork}</div>
          <div className="muted">в работе · выполнено: {done}</div>
        </Card>
      </div>

      <h2 className={styles.section}>Счёт</h2>
      <StateView loading={loading} error={error} onRetry={reload}>
        {user && (
          <div className={styles.layout}>
            <Card>
              <div className="muted">Баланс</div>
              <div className={styles.big}>{formatMoney(user.balance)}</div>
              <div className="muted">
                Баллы копятся за задачи и тратятся на аукционе
              </div>
            </Card>
            <Card>
              <div className="muted">Загрузка</div>
              <div className={styles.big}>{formatNumber(user.workload)}</div>
              <div className="muted">
                Чем выше загрузка, тем дороже задачи (коэффициент K2)
              </div>
            </Card>
          </div>
        )}
      </StateView>

      <Button
        variant="secondary"
        className={styles.logout}
        onClick={() => {
          logout()
          navigate('/login')
        }}
      >
        Выйти
      </Button>
    </>
  )
}
