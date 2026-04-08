import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { IconCheck } from '../Icons'
import styles from './ThemeSwitcher.module.css'

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = themes.find(t => t.id === theme)

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        aria-label="Сменить тему"
        title="Сменить тему"
      >
        <span className={styles.triggerDots}>
          {current.colors.map((c, i) => (
            <span key={i} className={styles.dot} style={{ background: c }} />
          ))}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`}
        >
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className={`${styles.dropdown} ${open ? styles.dropdownOpen : ''}`}>
        {themes.map((t) => (
          <button
            key={t.id}
            className={`${styles.option} ${t.id === theme ? styles.optionActive : ''}`}
            onClick={() => { setTheme(t.id); setOpen(false) }}
          >
            <span className={styles.optionColors}>
              {t.colors.map((c, i) => (
                <span key={i} className={styles.optionDot} style={{ background: c }} />
              ))}
            </span>
            <span className={styles.optionLabel}>{t.label}</span>
            {t.id === theme && (
              <IconCheck size={14} strokeWidth={2.5} className={styles.check} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
