import { Link, useSearchParams } from 'react-router-dom'
import { getTasks } from '../api'
import StateView from '../components/StateView'
import { Badge, Button, Card } from '../components/ui'
import { useFetch } from '../hooks/useFetch'
import { useApp } from '../store/context'
import {
  formatMoney,
  STATUS_LABEL,
  viewStatus,
  type ViewStatus,
} from '../utils/format'
import styles from './TasksPage.module.css'

type Filter = 'all' | 'mine' | ViewStatus

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'mine', label: 'Мои' },
  { value: 'open', label: 'Свободные' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'done', label: 'Выполненные' },
]

export default function TasksPage() {
  const { data, error, loading, reload } = useFetch(getTasks)
  const { myTasks, flags } = useApp()
  const [params, setParams] = useSearchParams()
  const filter: Filter = params.get('mine')
    ? 'mine'
    : ((params.get('status') as Filter | null) ?? 'all')

  function setFilter(f: Filter) {
    if (f === 'all') setParams({})
    else if (f === 'mine') setParams({ mine: '1' })
    else setParams({ status: f })
  }

  const tasks = (data ?? [])
    .map((t) => ({ ...t, view: viewStatus(t, myTasks), flag: flags[t.id] }))
    .filter((t) => {
      if (filter === 'all') return true
      if (filter === 'mine') return t.id in myTasks
      return t.view === filter
    })
    // «нужна помощь» и «горящие» — наверх ленты
    .sort((a, b) => Number(Boolean(b.flag)) - Number(Boolean(a.flag)))

  return (
    <>
      <h1>Задачи</h1>
      <p className="page-lead">
        Общая лента задач группы. Награда зависит от ранга задачи, сил, скорости
        и числа попыток — её считает сервер.
      </p>

      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={filter === f.value ? 'primary' : 'secondary'}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <StateView loading={loading} error={error} onRetry={reload}>
        {tasks.length === 0 ? (
          <p className="muted">
            {filter === 'mine'
              ? 'Вы пока не взяли ни одной задачи.'
              : 'В этой категории задач пока нет.'}
          </p>
        ) : (
          <div className="grid">
            {tasks.map((t) => (
              <Link key={t.id} to={`/tasks/${t.id}`} className={styles.link}>
                <Card
                  className={
                    t.flag ? `${styles.card} ${styles.flagged}` : styles.card
                  }
                >
                  <div className={styles.top}>
                    <Badge tone={t.view === 'open' ? 'solid' : 'outline'}>
                      {STATUS_LABEL[t.view]}
                    </Badge>
                    {t.flag === 'help' && (
                      <Badge tone="outline">🙋 Нужна помощь</Badge>
                    )}
                    {t.flag === 'hot' && (
                      <Badge tone="outline">🔥 Горящая</Badge>
                    )}
                    <Badge tone="muted">Ранг {t.rank ?? '—'}</Badge>
                    {t.id in myTasks && <Badge tone="muted">Моя</Badge>}
                  </div>
                  <h2 className={styles.title}>{t.title}</h2>
                  <p className={`muted ${styles.desc}`}>{t.description}</p>
                  <div className={styles.price}>{formatMoney(t.price)}</div>
                  <div className="muted">
                    Базовая цена: {formatMoney(t.basePrice)}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </StateView>
    </>
  )
}
