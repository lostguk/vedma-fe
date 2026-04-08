import styles from './GlassCard.module.css'

export default function GlassCard({ maxWidth, tint = 'primary', className, children }) {
  const cls = [styles.card, styles[tint], className].filter(Boolean).join(' ')
  return (
    <div className={cls} style={maxWidth ? { maxWidth } : undefined}>
      {children}
    </div>
  )
}
