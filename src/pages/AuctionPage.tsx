import { useState, type FormEvent } from 'react'
import { ApiError, getLots, getMe, placeBid } from '../api'
import StateView from '../components/StateView'
import { Badge, Button, Card, Input } from '../components/ui'
import { useFetch } from '../hooks/useFetch'
import { useApp } from '../store/context'
import type { Lot } from '../types'
import { formatDate, formatMoney, isPast, timeLeft } from '../utils/format'
import styles from './AuctionPage.module.css'

function LotCard({ lot, onChanged }: { lot: Lot; onChanged: () => void }) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string>()
  const [sending, setSending] = useState(false)
  const [showBids, setShowBids] = useState(false)
  const closed = isPast(lot.endsAt)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(undefined)
    const value = Number(amount.replace(',', '.'))
    if (!amount || Number.isNaN(value)) {
      setError('Введите сумму числом')
      return
    }
    setSending(true)
    try {
      await placeBid(lot.id, value)
      setAmount('')
      onChanged()
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Не удалось сделать ставку',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <Card className={styles.card}>
      <div className={styles.top}>
        <Badge tone={closed ? 'muted' : 'solid'}>
          {closed ? 'Торги закончены' : 'Идут торги'}
        </Badge>
        {!closed && <span className="muted">{timeLeft(lot.endsAt)}</span>}
      </div>
      <h2 className={styles.title}>{lot.title}</h2>
      <div className="muted">Текущая ставка</div>
      <div className={styles.bid}>{formatMoney(lot.currentBid)}</div>
      <div className="muted">до {formatDate(lot.endsAt)}</div>

      <form className={styles.form} onSubmit={submit}>
        <Input
          aria-label="Ваша ставка"
          placeholder={`Больше ${lot.currentBid}`}
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={closed || sending}
          error={error}
        />
        <Button type="submit" disabled={closed || sending}>
          {sending ? 'Отправляем…' : 'Сделать ставку'}
        </Button>
      </form>

      <button className={styles.toggle} onClick={() => setShowBids((v) => !v)}>
        {showBids ? 'Скрыть историю' : `История ставок (${lot.bids.length})`}
      </button>
      {showBids && (
        <ul className={styles.history}>
          {lot.bids.length === 0 && <li className="muted">Ставок пока нет</li>}
          {[...lot.bids].reverse().map((b, i) => (
            <li key={i}>
              <span>
                <b>{formatMoney(b.amount)}</b> · {b.userId}
              </span>
              <span className="muted">{formatDate(b.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

// Схема «Аукцион»: публикация слотов → участие → итоги → сгорание 50% баллов
const STAGES = [
  'Публикация слотов',
  'Торги',
  'Подведение итогов',
  'Сгорание 50% баллов',
]

export default function AuctionPage() {
  const lots = useFetch(getLots)
  const me = useFetch(getMe)
  const { group } = useApp()
  const list = lots.data ?? []
  const stage =
    list.length === 0 ? 0 : list.some((l) => !isPast(l.endsAt)) ? 1 : 2

  function refresh() {
    lots.reload()
    me.reload()
  }

  return (
    <>
      <div className={styles.head}>
        <div>
          <h1>Аукцион</h1>
          <p className="page-lead">
            Делайте ставки на привилегии. Побеждает самая высокая.
          </p>
        </div>
        {me.data && (
          <div className={styles.balance}>
            <span className="muted">Ваш баланс</span>
            <b>{formatMoney(me.data.balance)}</b>
          </div>
        )}
      </div>

      <ol className={styles.stages}>
        {STAGES.map((title, i) => (
          <li
            key={title}
            className={
              i === stage ? styles.stageNow : i < stage ? styles.stageDone : ''
            }
          >
            <span>{i + 1}</span>
            {title}
          </li>
        ))}
      </ol>
      <p className={`muted ${styles.burn}`}>
        После подведения итогов 50% неистраченных баллов сгорают — тратьте их с
        умом.
        {group?.isAdmin &&
          ' Вы админ: создание и настройка аукциона появятся в следующей версии.'}
      </p>

      <StateView
        loading={lots.loading}
        error={lots.error}
        onRetry={lots.reload}
      >
        {list.length === 0 ? (
          <Card>
            <h2>Ожидание</h2>
            <p className="muted">
              Админ ещё не опубликовал слоты аукциона. Загляните позже.
            </p>
          </Card>
        ) : (
          <div className="grid">
            {list.map((lot) => (
              <LotCard key={lot.id} lot={lot} onChanged={refresh} />
            ))}
          </div>
        )}
      </StateView>
    </>
  )
}
