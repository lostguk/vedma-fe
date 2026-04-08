import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProduct } from '../../api/products'
import ProductCard from '../../components/ProductSection/ProductCard'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import { Breadcrumbs, Button, PageShell } from '../../components/ui'
import { IconHeart, IconBag, IconCheck, IconUser, IconStar, IconTruck } from '../../components/Icons'
import { LazyImage } from '../../components/ui'
import styles from './ProductPage.module.css'

function formatPrice(n) {
  return Number(n).toLocaleString('ru-RU')
}

export default function ProductPage() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [activeImage, setActiveImage] = useState(0)
  const addedTimerRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setQty(1)
    setActiveTab('description')
    setActiveImage(0)

    getProduct(slug)
      .then((res) => {
        const data = res.data?.data ?? res.data
        setProduct(data)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) window.clearTimeout(addedTimerRef.current)
    }
  }, [])

  if (loading) {
    return (
      <PageShell>
        <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--color-text-muted)' }}>
          Загрузка...
        </div>
      </PageShell>
    )
  }

  if (error || !product) {
    return (
      <PageShell>
        <div className={styles.notFound}>
          <h1>Товар не найден</h1>
          <Button as={Link} to="/catalog" variant="primary" size="md">Вернуться в каталог</Button>
        </div>
      </PageShell>
    )
  }

  const productId = String(product.id)
  const favorite = isFavorite(productId)
  const oldPrice = product.old_price
  const discount = oldPrice
    ? Math.round((1 - product.price / oldPrice) * 100)
    : null
  const images = product.images_urls?.length ? product.images_urls : [product.image_url].filter(Boolean)
  const mainImage = images[activeImage] || images[0] || ''
  const related = product.related || []
  const inStock = product.in_stock !== false
  const tag = product.is_bestseller ? 'Хит продаж' : product.is_new ? 'Новинка' : null

  const breadcrumbs = [{ label: 'Главная', to: '/' }, { label: 'Каталог', to: '/catalog' }]
  if (product.breadcrumbs) {
    product.breadcrumbs.forEach((bc) => {
      if (bc.type === 'category') {
        breadcrumbs.push({ label: bc.name, to: `/catalog?category=${bc.slug}` })
      }
    })
  }
  breadcrumbs.push({ label: product.name })

  const categoryLabel = product.categories?.map(c => c.name).join(' / ') || 'Каталог'

  return (
    <PageShell>
      <Breadcrumbs items={breadcrumbs} />

      <div className={styles.main}>
        <div className={styles.imageSection}>
          <div className={styles.imageWrap}>
            <LazyImage src={mainImage} alt={product.name} className={styles.image} aspectRatio="1" />
            {tag && <span className={styles.tag}>{tag}</span>}
            {discount && <span className={styles.discount}>−{discount}%</span>}
          </div>
          {images.length > 1 && (
            <div className={styles.thumbs}>
              {images.map((url, i) => (
                <button
                  key={i}
                  className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={url} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <span className={styles.category}>{categoryLabel}</span>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{product.name}</h1>
            <button
              type="button"
              className={`${styles.favBtn} ${favorite ? styles.favBtnActive : ''}`}
              onClick={() => toggleFavorite(productId)}
              aria-label={favorite ? 'Убрать из избранного' : 'В избранное'}
              aria-pressed={favorite}
            >
              <IconHeart size={22} fill={favorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className={styles.priceRow}>
            <div className={styles.priceBlock}>
              {oldPrice && (
                <span className={styles.oldPrice}>{formatPrice(oldPrice)} ₽</span>
              )}
              <span className={styles.price}>{formatPrice(product.price)} ₽</span>
            </div>
            {discount && oldPrice && (
              <span className={styles.saveBadge}>Выгода {formatPrice(oldPrice - product.price)} ₽</span>
            )}
          </div>

          <p className={styles.desc}>{product.description}</p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <IconUser size={16} />
              Ручная работа
            </div>
            <div className={styles.feature}>
              <IconStar size={16} />
              100% натуральное
            </div>
            <div className={styles.feature}>
              <IconTruck size={16} />
              Быстрая доставка
            </div>
          </div>

          <div className={styles.actions}>
            {inStock ? (
              <>
                <div className={styles.qtyControl}>
                  <button type="button" className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className={styles.qtyVal}>{qty}</span>
                  <button type="button" className={styles.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
                </div>
                <button
                  type="button"
                  className={`${styles.addToCart} ${justAdded ? styles.addToCartAdded : ''}`}
                  disabled={justAdded}
                  onClick={() => {
                    addToCart(product, qty)
                setJustAdded(true)
                if (addedTimerRef.current) window.clearTimeout(addedTimerRef.current)
                addedTimerRef.current = window.setTimeout(() => {
                  setJustAdded(false)
                  setQty(1)
                  addedTimerRef.current = null
                }, 1500)
              }}
            >
              {justAdded ? (
                <>
                  <IconCheck size={18} />
                  Добавлено
                </>
              ) : (
                <>
                  <IconBag size={18} />
                  В корзину — {formatPrice(product.price * qty)} ₽
                </>
              )}
                </button>
              </>
            ) : (
              <div className={styles.outOfStock}>Нет в наличии</div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <div className={styles.tabList}>
          <button className={`${styles.tab} ${activeTab === 'description' ? styles.tabActive : ''}`} onClick={() => setActiveTab('description')}>
            Описание
          </button>
          <button className={`${styles.tab} ${activeTab === 'delivery' ? styles.tabActive : ''}`} onClick={() => setActiveTab('delivery')}>
            Доставка
          </button>
          <button className={`${styles.tab} ${activeTab === 'reviews' ? styles.tabActive : ''}`} onClick={() => setActiveTab('reviews')}>
            Отзывы
          </button>
        </div>
        <div className={styles.tabContent}>
          {activeTab === 'description' && (
            <div>
              <p>{product.description}</p>
            </div>
          )}
          {activeTab === 'delivery' && (
            <div>
              <p><strong>Доставка по России:</strong> от 3 рабочих дней</p>
              <p><strong>Стоимость:</strong> от 350 ₽ (бесплатно от 5 000 ₽)</p>
              <p><strong>Самовывоз:</strong> по предварительному согласованию</p>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className={styles.reviewsEmpty}>
              <p>Отзывов пока нет</p>
              <button className={styles.reviewBtn}>Оставить отзыв</button>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className={styles.related}>
          <h2 className={styles.relatedTitle}>Похожие товары</h2>
          <div className={styles.relatedGrid}>
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </PageShell>
  )
}
