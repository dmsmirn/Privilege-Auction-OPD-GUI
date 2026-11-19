import { Link } from 'react-router-dom'
import { getTasks } from '../api'
import StateView from '../components/StateView'
import { Card } from '../components/ui'
import { useFetch } from '../hooks/useFetch'
import type { TaskStatus } from '../types'
import { formatMoney } from '../utils/format'
import styles from './LobbyPage.module.css'

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: 'open', title: 'Свободные' },
  { status: 'in_progress', title: 'В работе' },
  { status: 'done', title: 'Выполнены' },
]

export default function LobbyPage() {
  const { data, error, loading, reload } = useFetch(getTasks)
  const tasks = data ?? []

  return (
    <>
      <h1>Лобби</h1>
      <p className="page-lead">
        Что сейчас происходит: какие задачи свободны, а какие уже взяты.
      </p>
      <StateView loading={loading} error={error} onRetry={reload}>
        <div className={styles.board}>
          {COLUMNS.map((col) => {
            const items = tasks.filter((t) => t.status === col.status)
            return (
              <section key={col.status} className={styles.column}>
                <h2 className={styles.colTitle}>
                  {col.title}{' '}
                  <span className={styles.count}>{items.length}</span>
                </h2>
                {items.length === 0 && <p className="muted">Пусто</p>}
                {items.map((t) => (
                  <Link
                    key={t.id}
                    to={`/tasks/${t.id}`}
                    className={styles.link}
                  >
                    <Card className={styles.item}>
                      <b>{t.title}</b>
                      <span className="muted">{formatMoney(t.price)}</span>
                    </Card>
                  </Link>
                ))}
              </section>
            )
          })}
        </div>
      </StateView>
    </>
  )
}
