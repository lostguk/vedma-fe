import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '../../context/CartContext'
import { IconX } from '../Icons'
import styles from './CartToast.module.css'

export default function CartToast() {
  const { toast, dismissToast, openDrawer } = useCart()

  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => dismissToast(), 3000)
    return () => clearTimeout(t)
  }, [toast, dismissToast])

  if (!toast) return null

  return createPortal(
    <div className={styles.wrap} role="status">
      <div className={styles.toast}>
        <span className={styles.text}>
          «{toast.name}» добавлен в корзину
        </span>
        <button
          type="button"
          className={styles.openBtn}
          onClick={() => {
            dismissToast()
            openDrawer()
          }}
        >
          Открыть
        </button>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={dismissToast}
          aria-label="Закрыть"
        >
          <IconX size={14} />
        </button>
      </div>
    </div>,
    document.body,
  )
}
