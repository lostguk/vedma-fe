import { Link } from 'react-router-dom'
import styles from './Breadcrumbs.module.css'

export default function Breadcrumbs({ items, className }) {
  return (
    <nav className={`${styles.nav} ${className || ''}`} aria-label="Хлебные крошки">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={item.label} className={styles.item}>
            {i > 0 && <span className={styles.sep}>/</span>}
            {isLast || !item.to ? (
              <span className={styles.current}>{item.label}</span>
            ) : (
              <Link to={item.to} className={styles.link}>{item.label}</Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
