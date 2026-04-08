import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '../../api/categories'
import { IconHeart, IconMail } from '../Icons'
import styles from './Footer.module.css'

export default function Footer() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getCategories()
      .then((res) => {
        const data = res.data?.data ?? res.data
        setCategories(Array.isArray(data) ? data.slice(0, 4) : [])
      })
      .catch(() => {})
  }, [])

  return (
    <footer className={styles.footer} id="contacts">
      <div className={styles.topDecor}>
        <svg viewBox="0 0 1440 60" fill="none" className={styles.wave}>
          <path d="M0 30 C360 0 720 60 1080 30 C1260 15 1380 25 1440 30 V60 H0 Z" fill="currentColor"/>
        </svg>
      </div>

      <div className={`container ${styles.container}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoMain}>Ведьмино</span>
              <span className={styles.logoAccent}>Зелье</span>
            </Link>
            <p className={styles.brandDesc}>
              Авторские свечи, зелья и артефакты ручной работы. Магия живёт в каждом из нас.
            </p>
            <div className={styles.socials}>
              <a href="https://t.me/vedminozelie" className={styles.social} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </a>
              <a href="https://vk.com/vedminozelie" className={styles.social} target="_blank" rel="noopener noreferrer" aria-label="VK">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.8 13.6h-1.24c-.47 0-.61-.37-1.45-1.22-.73-.7-1.05-.8-1.23-.8-.25 0-.33.07-.33.43v1.12c0 .3-.1.48-1.02.48-1.49 0-3.14-.9-4.3-2.59C4.94 10.96 4.5 9.26 4.5 8.97c0-.18.07-.35.43-.35h1.24c.32 0 .44.15.57.49.62 1.79 1.65 3.36 2.08 3.36.16 0 .23-.07.23-.48V10.2c-.05-.82-.48-.89-.48-1.18 0-.14.12-.29.31-.29h1.96c.27 0 .36.14.36.47v2.32c0 .27.12.36.2.36.16 0 .29-.09.58-.38.9-1.01 1.54-2.57 1.54-2.57.09-.18.23-.35.56-.35h1.24c.37 0 .46.19.37.47-.15.7-1.67 2.86-1.67 2.86-.13.22-.18.31 0 .56.13.18.55.55.84.89.53.61.94 1.12 1.05 1.47.11.36-.08.54-.44.54z"/>
                </svg>
              </a>
              <a href="mailto:info@vedminozelie.ru" className={styles.social} aria-label="Email">
                <IconMail size={18} />
              </a>
            </div>
          </div>

          <nav className={styles.nav}>
            <h4 className={styles.navTitle}>Навигация</h4>
            <Link to="/catalog" className={styles.navLink}>Каталог</Link>
            <Link to="/favorites" className={styles.navLink}>Избранное</Link>
            <Link to="/delivery" className={styles.navLink}>Доставка и оплата</Link>
            <Link to="/contacts" className={styles.navLink}>Контакты</Link>
          </nav>

          <div className={styles.nav}>
            <h4 className={styles.navTitle}>Каталог</h4>
            {categories.map((cat) => (
              <Link key={cat.id} to={`/catalog?category=${cat.slug}`} className={styles.navLink}>{cat.name}</Link>
            ))}
            {categories.length === 0 && (
              <Link to="/catalog" className={styles.navLink}>Все товары</Link>
            )}
          </div>

          <div className={styles.nav}>
            <h4 className={styles.navTitle}>Контакты</h4>
            <a href="mailto:info@vedminozelie.ru" className={styles.navLink}>
              info@vedminozelie.ru
            </a>
            <a href="https://t.me/vedminozelie" className={styles.navLink} target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.legal}>
          <Link to="/privacy" className={styles.legalLink}>Политика конфиденциальности</Link>
          <span className={styles.legalDot}>&middot;</span>
          <Link to="/offer" className={styles.legalLink}>Публичная оферта</Link>
          <span className={styles.legalDot}>&middot;</span>
          <Link to="/returns" className={styles.legalLink}>Обмен и возврат</Link>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy}>
            &copy; {new Date().getFullYear()} Ведьмино Зелье. Все права защищены.
          </span>
          <span className={styles.made}>
            Сделано с
            <IconHeart size={14} fill="currentColor" style={{ margin: '0 4px', verticalAlign: '-2px', opacity: 0.6 }} />
            и магией
          </span>
        </div>
      </div>
    </footer>
  )
}
