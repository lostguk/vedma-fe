import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { IconX, IconChevronLeft, IconChevronRight } from '../Icons'
import styles from './Lightbox.module.css'

export default function Lightbox({ images, startIndex = 0, onClose }) {
  const [idx, setIdx] = useState(startIndex)
  const total = images.length

  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total])
  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, prev, next])

  const img = images[idx]

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <img src={img.preview || img.src || img} alt={img.name || ''} className={styles.image} />
      </div>

      <button className={styles.close} onClick={onClose} aria-label="Закрыть">
        <IconX size={24} />
      </button>

      {total > 1 && (
        <>
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={(e) => { e.stopPropagation(); prev() }} aria-label="Назад">
            <IconChevronLeft size={28} />
          </button>
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={(e) => { e.stopPropagation(); next() }} aria-label="Вперёд">
            <IconChevronRight size={28} />
          </button>
          <div className={styles.counter}>{idx + 1} / {total}</div>
        </>
      )}
    </div>,
    document.body,
  )
}
