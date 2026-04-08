import { useState, useEffect } from 'react'
import { getProducts } from '../../api/products'
import ProductCard from '../../components/ProductSection/ProductCard'
import ProductCardSkeleton from '../../components/ProductSection/ProductCardSkeleton'
import { useFavorites } from '../../context/FavoritesContext'
import { Breadcrumbs, EmptyState, PageShell } from '../../components/ui'
import { IconHeart } from '../../components/Icons'
import styles from './FavoritesPage.module.css'

function formatCount(n) {
  if (n === 0) return 'Нет сохранённых товаров'
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return `${n} товар`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} товара`
  return `${n} товаров`
}

export default function FavoritesPage() {
  const { ids } = useFavorites()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([])
      return
    }

    setLoading(true)
    getProducts({ ids: ids.join(','), per_page: 100 })
      .then((res) => {
        const items = res.data?.data || []
        setProducts(items)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [ids])

  return (
    <PageShell>
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Избранное' }]} />

      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Избранное</h1>
          <p className={styles.pageCount}>
            {loading ? 'Загрузка...' : formatCount(products.length)}
          </p>
        </div>
      </header>

      {!loading && products.length === 0 && ids.length === 0 && (
        <EmptyState
          icon={<IconHeart size={56} strokeWidth={1} />}
          title="Список пуст"
          description="Добавляйте товары в избранное, нажав на сердечко на карточке или на странице товара."
          actionLabel="Перейти в каталог"
          actionTo="/catalog"
        />
      )}

      {loading && (
        <div className={styles.grid}>
          {Array.from({ length: ids.length }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </PageShell>
  )
}
