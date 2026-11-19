import styles from './Loader.module.css'

export default function Loader({ label = 'Загрузка…' }: { label?: string }) {
  return (
    <div className={styles.wrap} role="status">
      <span className={styles.spinner} />
      <span>{label}</span>
    </div>
  )
}
