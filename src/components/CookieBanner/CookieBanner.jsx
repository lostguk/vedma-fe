import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'
import styles from './CookieBanner.module.css'

const STORAGE_KEY = 'vedmino-cookie-consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* noop */ }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={styles.banner} role="alert">
      <div className={`container ${styles.inner}`}>
        <p className={styles.text}>
          Мы используем файлы cookie для работы корзины, сохранения избранного и улучшения сайта.
          Продолжая использовать сайт, вы соглашаетесь с{' '}
          <Link to="/privacy" className={styles.link}>Политикой конфиденциальности</Link>.
        </p>
        <Button variant="primary" size="sm" onClick={accept}>
          Принять
        </Button>
      </div>
    </div>
  )
}
