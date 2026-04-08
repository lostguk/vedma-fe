import { Link } from 'react-router-dom'
import Button from '../Button/Button'
import styles from './EmptyState.module.css'

export default function EmptyState({ icon, title, description, actionLabel, actionTo, onAction }) {
  return (
    <div className={styles.wrap}>
      {icon && <div className={styles.icon} aria-hidden>{icon}</div>}
      {title && <p className={styles.title}>{title}</p>}
      {description && <p className={styles.desc}>{description}</p>}
      {actionLabel && actionTo && (
        <Button as={Link} to={actionTo} variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {actionLabel && !actionTo && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
