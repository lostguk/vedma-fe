import styles from './SectionHeader.module.css'

export default function SectionHeader({ label, title, description, align = 'center', className }) {
  return (
    <div className={`${styles.header} ${styles[align]} ${className || ''}`}>
      {label && <span className={styles.label}>{label}</span>}
      {title && <h2 className={styles.title}>{title}</h2>}
      {description && <p className={styles.desc}>{description}</p>}
    </div>
  )
}
