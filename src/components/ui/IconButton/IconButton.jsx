import { forwardRef } from 'react'
import styles from './IconButton.module.css'

const IconButton = forwardRef(function IconButton(
  { label, active, size = 'md', className, children, ...rest },
  ref,
) {
  const cls = [
    styles.btn,
    styles[size],
    active && styles.active,
    className,
  ].filter(Boolean).join(' ')

  return (
    <button ref={ref} type="button" className={cls} aria-label={label} {...rest}>
      {children}
    </button>
  )
})

export default IconButton
