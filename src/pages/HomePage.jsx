import { useState, useEffect } from 'react'
import Hero from '../components/Hero/Hero'
import Features from '../components/Features/Features'
import ProductSection from '../components/ProductSection/ProductSection'
import About from '../components/About/About'
import { BotanicalDivider } from '../components/Icons'
import { getHomeContent } from '../api/home'
import useScrollReveal from '../hooks/useScrollReveal'

export default function HomePage() {
  const mainRef = useScrollReveal()
  const [slides, setSlides] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHomeContent()
      .then((res) => {
        const data = res.data?.data ?? res.data
        setSlides(data.slides || [])
        setCategories(data.categories || [])
      })
      .catch(() => {
        setSlides([])
        setCategories([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div ref={mainRef}>
      <Hero slides={slides} />

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
          Загрузка товаров...
        </div>
      )}

      {!loading && categories
        .filter((cat) => cat.products?.length > 0)
        .map((cat, i) => (
          <div className="reveal" key={cat.id}>
            <ProductSection
              id={i === 0 ? 'products' : undefined}
              label={cat.name}
              title={cat.description ? undefined : cat.name}
              description={cat.description}
              products={cat.products}
              reversed={i % 2 !== 0}
              linkTo={`/catalog?category=${cat.slug}`}
              linkLabel={`Все ${cat.name.toLowerCase()}`}
            />
          </div>
        ))}

      {!loading && categories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
          Нет товаров для отображения
        </div>
      )}

      <div className="botanical-divider-wrap">
        <BotanicalDivider className="botanical-divider" />
      </div>

      <div className="reveal">
        <Features />
      </div>

      <div className="botanical-divider-wrap">
        <BotanicalDivider className="botanical-divider" />
      </div>

      <div className="reveal">
        <About />
      </div>
    </div>
  )
}
