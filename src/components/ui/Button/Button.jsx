import { forwardRef } from 'react'
import styles from './Button.module.css'

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', as: Tag = 'button', fullWidth, loading, className, children, ...rest },
  ref,
) {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth && styles.full,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag ref={ref} className={cls} disabled={loading || rest.disabled} {...rest}>
      {loading && <span className={styles.spinner} aria-hidden />}
      {children}
    </Tag>
  )
})

export default Button
