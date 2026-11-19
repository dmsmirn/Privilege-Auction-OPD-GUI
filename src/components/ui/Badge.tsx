import type { ReactNode } from 'react'
import styles from './Badge.module.css'

interface BadgeProps {
  tone?: 'solid' | 'outline' | 'muted'
  children: ReactNode
}

export default function Badge({ tone = 'outline', children }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>
}
