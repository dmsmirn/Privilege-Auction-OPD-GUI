import { useEffect, useState } from 'react'
import { previewPrice } from '../api'
import { Card } from '../components/ui'
import type { TaskRank } from '../types'
import { formatMoney, formatNumber, RANKS } from '../utils/format'
import styles from './DemoPage.module.css'

interface Preview {
  price?: number
  error?: string
}

// Формула библиотеки pa::Engine:
// Награда = Базовая цена + M × K1 × K2 × K3 − Штраф
export default function DemoPage() {
  const [rank, setRank] = useState<TaskRank>('B')
  const [basePrice, setBasePrice] = useState(300)
  const [k1, setK1] = useState(1.2)
  const [k2, setK2] = useState(2.7)
  const [attempts, setAttempts] = useState(1)
  const [preview, setPreview] = useState<Preview>({})

  // K3 по спецификации: 1 − 0.15 × (попытки − 1), попыток не больше 5
  const k3 = Math.round((1 - 0.15 * (attempts - 1)) * 100) / 100

  // Награду считает сервер: отправляем значения и показываем ответ
  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      previewPrice({ basePrice, rank, k1, k2, k3 })
        .then((r) => {
          if (!cancelled) setPreview({ price: r.price })
        })
        .catch((e: Error) => {
          if (!cancelled) setPreview({ error: e.message })
        })
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [basePrice, rank, k1, k2, k3])

  return (
    <>
      <h1>Демо</h1>
      <p className="page-lead">
        Как библиотека считает награду за задачу. Меняйте параметры — сервер
        сразу пересчитает.
      </p>

      <div className={styles.layout}>
        <Card>
          <div className={styles.row}>
            <span className={styles.rowHead}>
              <b>Ранг задачи</b>
              <span>M = {RANKS[rank].m}</span>
            </span>
            <div className={styles.ranks}>
              {(Object.keys(RANKS) as TaskRank[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={
                    r === rank
                      ? `${styles.rank} ${styles.rankActive}`
                      : styles.rank
                  }
                  onClick={() => setRank(r)}
                >
                  <b>{r}</b>
                  <span>{RANKS[r].title}</span>
                </button>
              ))}
            </div>
            <span className="muted">
              Базовая цена для ранга {rank}: {RANKS[rank].range} баллов
            </span>
          </div>

          <label className={styles.row}>
            <span className={styles.rowHead}>
              <b>Базовая цена</b>
              <span>{formatNumber(basePrice)}</span>
            </span>
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
            />
          </label>

          <label className={styles.row}>
            <span className={styles.rowHead}>
              <b>K1 · время</b>
              <span>{formatNumber(k1)}</span>
            </span>
            <input
              type="range"
              min={0.1}
              max={3}
              step={0.1}
              value={k1}
              onChange={(e) => setK1(Number(e.target.value))}
            />
            <span className="muted">
              план / факт: сдали в срок — 1, вдвое быстрее — 2, максимум 3
            </span>
          </label>

          <label className={styles.row}>
            <span className={styles.rowHead}>
              <b>K2 · силы</b>
              <span>{formatNumber(k2)}</span>
            </span>
            <input
              type="range"
              min={1}
              max={5}
              step={0.1}
              value={k2}
              onChange={(e) => setK2(Number(e.target.value))}
            />
            <span className="muted">
              0.2 × объём + 0.3 × сложность + 0.5 × риски, каждое от 1 до 5
            </span>
          </label>

          <label className={styles.row}>
            <span className={styles.rowHead}>
              <b>K3 · попытки</b>
              <span>
                {attempts} → {formatNumber(k3)}
              </span>
            </span>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={attempts}
              onChange={(e) => setAttempts(Number(e.target.value))}
            />
            <span className="muted">
              каждая лишняя попытка −15%, не больше 5 попыток
            </span>
          </label>
        </Card>

        <Card className={styles.result}>
          <div className="muted">Награда за задачу</div>
          {preview.error ? (
            <p className={styles.err}>{preview.error}</p>
          ) : (
            <div className={styles.price}>
              {preview.price === undefined ? '…' : formatMoney(preview.price)}
            </div>
          )}
          <div className={`muted ${styles.formula}`}>
            {formatNumber(basePrice)} + {RANKS[rank].m} × {formatNumber(k1)} ×{' '}
            {formatNumber(k2)} × {formatNumber(k3)}
          </div>
          <div className={`muted ${styles.note}`}>
            При просрочке вычитается штраф: для ранга D — 15% базовой цены, для
            остальных — до 90%.
          </div>
        </Card>
      </div>
    </>
  )
}
