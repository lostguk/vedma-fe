import styles from './ProductCardSkeleton.module.css'

export default function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.image} />
      <div className={styles.body}>
        <div className={styles.title} />
        <div className={styles.titleShort} />
        <div className={styles.footer}>
          <div className={styles.price} />
          <div className={styles.button} />
        </div>
      </div>
    </div>
  )
}
