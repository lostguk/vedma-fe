import { IconPhone, IconClock } from '../Icons'
import styles from './Header.module.css'

export default function TopBar() {
  return (
    <div className={styles.topBar}>
      <div className={`container ${styles.topBarInner}`}>
        <a href="tel:+79001234567" className={styles.topBarLink}>
          <IconPhone size={12} strokeWidth={2.2} />
          +7 (900) 123-45-67
        </a>
        <span className={styles.topBarDot}>&middot;</span>
        <span className={styles.topBarText}>
          <IconClock size={12} />
          Ежедневно 10:00–21:00
        </span>
      </div>
    </div>
  )
}
