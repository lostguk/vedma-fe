import { useState, useRef, useEffect } from 'react'
import styles from './LazyImage.module.css'

export default function LazyImage({ src, alt, className, aspectRatio, ...rest }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    setLoaded(false)
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [src])

  return (
    <div
      className={`${styles.wrap} ${loaded ? styles.loaded : ''} ${className || ''}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <div className={styles.skeleton} />
      {src && (
        <img
          ref={imgRef}
          src={src}
          alt={alt || ''}
          className={styles.img}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          draggable={false}
          {...rest}
        />
      )}
    </div>
  )
}
