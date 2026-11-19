import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTask } from '../api'
import StateView from '../components/StateView'
import { Badge, Card } from '../components/ui'
import { useFetch } from '../hooks/useFetch'
import { useApp } from '../store/context'
import TaskActions from './TaskActions'
import {
  formatDate,
  formatMoney,
  formatNumber,
  rankInfo,
  STATUS_LABEL,
  viewStatus,
} from '../utils/format'
import styles from './TaskDetailPage.module.css'

export default function TaskDetailPage() {
  const { id = '' } = useParams()
  const load = useCallback(() => getTask(id), [id])
  const { data: task, error, loading, reload } = useFetch(load)
  const { myTasks, flags } = useApp()
  const status = task ? viewStatus(task, myTasks) : 'open'

  return (
    <>
      <Link to="/tasks" className={styles.back}>
        ← Все задачи
      </Link>
      <StateView loading={loading} error={error} onRetry={reload}>
        {task && (
          <>
            <div className={styles.head}>
              <h1>{task.title}</h1>
              <Badge tone="muted">Ранг {rankInfo(task.rank).key}</Badge>
              <Badge tone={status === 'open' ? 'solid' : 'outline'}>
                {STATUS_LABEL[status]}
              </Badge>
              {flags[task.id] === 'help' && <Badge>🙋 Нужна помощь</Badge>}
              {flags[task.id] === 'hot' && <Badge>🔥 Горящая</Badge>}
            </div>
            <p className="page-lead">{task.description}</p>

            <div className={styles.columns}>
              <div className={styles.side}>
                <TaskActions id={task.id} status={status} />
                <Card>
                  <h2>Как начисляются баллы</h2>
                  <ul className={styles.rules}>
                    <li>
                      Админ проверяет, что задача выполнена корректно. Если нет
                      — на доработку.
                    </li>
                    <li>
                      Сдали <b>раньше срока</b> — бонус за время.
                    </li>
                    <li>
                      Сдали <b>в срок</b> — цена задачи без бонуса.
                    </li>
                    <li>
                      <b>Просрочили</b> — штраф.
                    </li>
                  </ul>
                </Card>
              </div>
              <Card>
                <h2>Как считается награда</h2>
                <p className={`muted ${styles.formula}`}>
                  Базовая цена + M × K1 × K2 × K3 − Штраф
                </p>
                <table className={styles.table}>
                  <tbody>
                    <tr>
                      <td>Базовая цена</td>
                      <td className={styles.num}>
                        {formatMoney(task.basePrice)}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>M</b> · ранг {rankInfo(task.rank).key}
                        <span className="muted">
                          {' '}
                          ({rankInfo(task.rank).title.toLowerCase()})
                        </span>
                      </td>
                      <td className={styles.num}>× {rankInfo(task.rank).m}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>K1</b> · время
                        <span className="muted"> — в срок 1, быстрее до 3</span>
                      </td>
                      <td className={styles.num}>× {formatNumber(task.k1)}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>K2</b> · силы
                        <span className="muted">
                          {' '}
                          — объём, сложность, риски
                        </span>
                      </td>
                      <td className={styles.num}>× {formatNumber(task.k2)}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>K3</b> · попытки
                        <span className="muted"> — каждая лишняя −15%</span>
                      </td>
                      <td className={styles.num}>× {formatNumber(task.k3)}</td>
                    </tr>
                    <tr>
                      <td>
                        Штраф
                        <span className="muted"> — только при просрочке</span>
                      </td>
                      <td className={styles.num}>− 0</td>
                    </tr>
                    <tr className={styles.total}>
                      <td>Награда (считает сервер)</td>
                      <td className={styles.num}>{formatMoney(task.price)}</td>
                    </tr>
                  </tbody>
                </table>
                <p className={`muted ${styles.date}`}>
                  Создана: {formatDate(task.createdAt)}
                </p>
              </Card>
            </div>
          </>
        )}
      </StateView>
    </>
  )
}
