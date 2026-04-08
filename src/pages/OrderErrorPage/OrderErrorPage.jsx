import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, GlassCard } from '../../components/ui'
import { IconPhone, IconMail } from '../../components/Icons'
import styles from './OrderErrorPage.module.css'

export default function OrderErrorPage() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setShow(true))
  }, [])

  return (
    <div className={`${styles.page} ${show ? styles.pageVisible : ''}`}>
      <div className={styles.bg}>
        <div className={styles.circle} />
      </div>

      <div className={`container ${styles.center}`}>
        <GlassCard maxWidth={500} tint="error">
          <div className={styles.iconWrap}>
            <svg className={styles.errorSvg} viewBox="0 0 80 80" fill="none">
              <circle
                className={styles.errorCircle}
                cx="40" cy="40" r="36"
                stroke="var(--color-accent, #c94a4a)"
                strokeWidth="3"
              />
              <path
                className={styles.errorX1}
                d="M28 28l24 24"
                stroke="var(--color-accent, #c94a4a)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                className={styles.errorX2}
                d="M52 28L28 52"
                stroke="var(--color-accent, #c94a4a)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className={styles.title}>Что-то пошло не так</h1>
          <p className={styles.subtitle}>
            К сожалению, при оформлении заказа произошла ошибка. Не волнуйтесь — деньги не были списаны.
            Попробуйте повторить заказ или свяжитесь с нами.
          </p>

          <div className={styles.help}>
            <div className={styles.helpItem}>
              <IconPhone size={18} />
              <span>Позвоните нам: <strong>+7 (800) 123-45-67</strong></span>
            </div>
            <div className={styles.helpItem}>
              <IconMail size={18} />
              <span>Напишите: <strong>help@vedmino-zelie.ru</strong></span>
            </div>
          </div>

          <div className={styles.actions}>
            <Button as={Link} to="/checkout" variant="primary" size="lg">Попробовать снова</Button>
            <Button as={Link} to="/" variant="ghost" size="lg">На главную</Button>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
