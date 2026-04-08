import { useState, useEffect } from 'react'
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher'
import styles from './FloatingPanel.module.css'

export default function FloatingPanel() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`${styles.panel} ${visible ? styles.panelVisible : ''}`}>
      <ThemeSwitcher />
    </div>
  )
}
