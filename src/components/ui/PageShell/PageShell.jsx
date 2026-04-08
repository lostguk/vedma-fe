import styles from './PageShell.module.css'

export default function PageShell({ className, children }) {
  return (
    <div className={`${styles.page} ${className || ''}`}>
      <div className="container">
        {children}
      </div>
    </div>
  )
}
