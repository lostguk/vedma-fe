import { Link } from 'react-router-dom'
import { IconArrowRight } from '../Icons'
import ProductCard from './ProductCard'
import styles from './ProductSection.module.css'

export default function ProductSection({ label, title, description, products, reversed, id, linkTo, linkLabel }) {
  return (
    <section className={`${styles.section} ${reversed ? styles.sectionAlt : ''}`} id={id || undefined}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <span className={styles.label}>{label}</span>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.desc}>{description}</p>}
        </div>

        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {linkTo && (
          <Link to={linkTo} className={styles.sectionLink}>
            <span>{linkLabel || 'Смотреть все'}</span>
            <IconArrowRight size={18} />
          </Link>
        )}
      </div>
    </section>
  )
}
