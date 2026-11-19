import { useState } from 'react'
import { Button, Card } from '../components/ui'
import { useApp } from '../store/context'
import type { ViewStatus } from '../utils/format'
import styles from './TaskDetailPage.module.css'

// Блок действий по схемам «Контроль и оценка» и «Форс-мажор и Помощь»
export default function TaskActions({
  id,
  status,
}: {
  id: string
  status: ViewStatus
}) {
  const app = useApp()
  const [fmOpen, setFmOpen] = useState(false)
  const [reason, setReason] = useState('')
  const mine = id in app.myTasks
  const fmReason = app.forceMajeure[id]
  const isAdmin = app.group?.isAdmin ?? false

  if (status === 'open') {
    return (
      <Card className={styles.actions}>
        <h2>Взять задачу?</h2>
        <p className="muted">После выполнения баллы начислятся на ваш счёт.</p>
        <Button onClick={() => app.takeTask(id)}>Взять задачу</Button>
      </Card>
    )
  }

  if (status === 'review') {
    return (
      <Card className={styles.actions}>
        <h2>На проверке</h2>
        <p className="muted">
          Админ проверит, что задача выполнена корректно. Если нет — её вернут
          на доработку.
        </p>
        {isAdmin && (
          <Button onClick={() => app.acceptTask(id)}>
            Принять работу (админ)
          </Button>
        )}
      </Card>
    )
  }

  if (status === 'done' || !mine) {
    return (
      <Card className={styles.actions}>
        <h2>
          {status === 'done'
            ? 'Задача выполнена'
            : 'Задачу выполняет другой участник'}
        </h2>
        {status !== 'done' && app.flags[id] !== 'help' && (
          <p className="muted">
            Если он попросит помощи, задача появится в ленте с отметкой.
          </p>
        )}
      </Card>
    )
  }

  // задача в работе у текущего пользователя
  return (
    <Card className={styles.actions}>
      <h2>Задача у вас в работе</h2>
      <Button onClick={() => app.submitTask(id)}>Сдать на проверку</Button>

      <div className={styles.trouble}>
        <b>Возникли трудности?</b>
        <div className={styles.troubleButtons}>
          <Button
            variant="secondary"
            size="sm"
            disabled={app.flags[id] === 'help'}
            onClick={() => app.askHelp(id)}
          >
            {app.flags[id] === 'help' ? 'Помощь запрошена' : '🙋 Помощь'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={Boolean(fmReason)}
            onClick={() => setFmOpen(true)}
          >
            ⚠️ Форс-мажор
          </Button>
        </div>
        {app.flags[id] === 'help' && (
          <p className="muted">
            Задача размещена в ленте с отметкой «нужна помощь».
          </p>
        )}
      </div>

      {fmOpen && !fmReason && (
        <form
          className={styles.fm}
          onSubmit={(e) => {
            e.preventDefault()
            if (!reason.trim()) return
            app.sendForceMajeure(id, reason.trim())
            setFmOpen(false)
          }}
        >
          <label htmlFor="fm-reason">
            <b>Причина для админа</b>
          </label>
          <textarea
            id="fm-reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Например: заболел, не смогу выполнить в срок"
          />
          <div className={styles.troubleButtons}>
            <Button type="submit" size="sm" disabled={!reason.trim()}>
              Отправить админу
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setFmOpen(false)}
            >
              Отмена
            </Button>
          </div>
        </form>
      )}

      {fmReason && (
        <div className={styles.fmSent}>
          <b>Форс-мажор отправлен админу</b>
          <p className="muted">
            «{fmReason}». Если админ одобрит — задача станет «горящей» и уйдёт в
            ленту. Если нет — останется у вас.
          </p>
          {isAdmin && (
            <div className={styles.troubleButtons}>
              <Button
                size="sm"
                onClick={() => app.resolveForceMajeure(id, true)}
              >
                Одобрить (админ)
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => app.resolveForceMajeure(id, false)}
              >
                Отклонить
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
