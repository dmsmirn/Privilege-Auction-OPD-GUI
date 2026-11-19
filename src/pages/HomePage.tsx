import { Link } from 'react-router-dom'
import { getLots, getMe, getTasks } from '../api'
import { Badge, Card } from '../components/ui'
import { useFetch } from '../hooks/useFetch'
import { useApp } from '../store/context'
import { formatMoney, isPast, timeLeft, viewStatus } from '../utils/format'
import styles from './HomePage.module.css'

export default function HomePage() {
  const { session, group, myTasks, flags } = useApp()
  const tasks = useFetch(getTasks)
  const me = useFetch(getMe)
  const lots = useFetch(getLots)

  const all = tasks.data ?? []
  const open = all.filter((t) => viewStatus(t, myTasks) === 'open').length
  const mine = Object.values(myTasks).filter((s) => s === 'in_progress').length
  const needHelp = Object.values(flags).length
  const activeLots = (lots.data ?? []).filter((l) => !isPast(l.endsAt))
  const nearest = [...activeLots].sort((a, b) =>
    a.endsAt.localeCompare(b.endsAt),
  )[0]
  const offline = tasks.error ?? me.error

  // Общая блок-схема: задачи → выполнение → накопление баллов → аукцион
  const steps = [
    {
      to: '/tasks',
      title: 'Задачи',
      text: group?.isAdmin
        ? 'Создавайте задачи и распределяйте их между участниками.'
        : 'Берите задачи из общей ленты.',
      value: tasks.data ? `${open} свободно` : '—',
    },
    {
      to: '/tasks?mine=1',
      title: 'Выполнение',
      text: 'Сложно? Нажмите «Помощь» или «Форс-мажор» в задаче.',
      value: `${mine} в работе`,
    },
    {
      to: '/me',
      title: 'Баллы',
      text: 'За выполненные задачи баллы копятся на счёте. За скорость — бонус, за просрочку — штраф.',
      value: me.data ? formatMoney(me.data.balance) : '—',
    },
    {
      to: '/auction',
      title: 'Аукцион',
      text: 'Тратьте баллы на привилегии. После аукциона 50% оставшихся баллов сгорают.',
      value: nearest ? timeLeft(nearest.endsAt) : 'ожидание',
    },
  ]

  return (
    <>
      <div className={styles.head}>
        <div>
          <h1>Привет, {session?.name}!</h1>
          <p className="page-lead">
            Группа «{group?.name}»{' '}
            {group?.isAdmin && <Badge tone="solid">Админ</Badge>}{' '}
            <Link to="/groups" className={styles.change}>
              сменить
            </Link>
          </p>
        </div>
      </div>

      {offline && (
        <p className={styles.offline}>
          Сервер недоступен: часть данных не загрузилась. Запустите C++-сервер.
        </p>
      )}

      <ol className={styles.path}>
        {steps.map((s, i) => (
          <li key={s.title}>
            <Link to={s.to} className={styles.link}>
              <Card className={styles.step}>
                <span className={styles.num}>{i + 1}</span>
                <h2 className={styles.stepTitle}>{s.title}</h2>
                <p className={`muted ${styles.text}`}>{s.text}</p>
                <div className={styles.value}>{s.value}</div>
              </Card>
            </Link>
          </li>
        ))}
      </ol>

      {needHelp > 0 && (
        <Card className={styles.help}>
          <b>Нужна помощь: {needHelp}</b>
          <span className="muted">
            Задачи с этой отметкой видны всем в ленте.
          </span>
          <Link to="/tasks">Открыть ленту →</Link>
        </Card>
      )}
    </>
  )
}
