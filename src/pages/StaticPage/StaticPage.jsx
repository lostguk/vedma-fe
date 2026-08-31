import { useState, useEffect } from 'react'
import { useLocation, Link, Navigate } from 'react-router-dom'
import { getPage } from '../../api/pages'
import { Breadcrumbs, PageShell, Button } from '../../components/ui'
import styles from './StaticPage.module.css'

const PAGE_CONFIG = {
  '/delivery': { apiId: 3, fallbackTitle: 'Доставка и оплата' },
  '/returns': { apiId: 4, fallbackTitle: 'Обмен и возврат' },
  '/contacts': { apiId: 5, fallbackTitle: 'Контакты' },
  '/privacy': { apiId: 7, fallbackTitle: 'Политика конфиденциальности' },
  '/offer': { apiId: 6, fallbackTitle: 'Публичная оферта' },
}

function ApiPageContent({ apiId, fallbackTitle }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPage(apiId)
      .then((res) => {
        const page = res.data?.data ?? res.data
        setData(page)
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [apiId])

  const title = data?.title || fallbackTitle

  if (loading) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: fallbackTitle }]} />
        <h1 className={styles.title}>{fallbackTitle}</h1>
        <p className={styles.loading}>Загрузка...</p>
      </>
    )
  }

  if (!data) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: fallbackTitle }]} />
        <h1 className={styles.title}>{fallbackTitle}</h1>
        <p className={styles.description}>Не удалось загрузить содержимое страницы.</p>
        <Button as={Link} to="/catalog" variant="primary" size="md">Перейти в каталог</Button>
      </>
    )
  }

  return (
    <>
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: title }]} />
      <h1 className={styles.title}>{title}</h1>
      {data.description && <p className={styles.description}>{data.description}</p>}
      {data.text && (
        <div className={styles.richText} dangerouslySetInnerHTML={{ __html: data.text }} />
      )}
    </>
  )
}

export default function StaticPage() {
  const { pathname } = useLocation()
  const config = PAGE_CONFIG[pathname]

  if (!config) return <Navigate to="/" replace />

  return (
    <PageShell>
      <ApiPageContent apiId={config.apiId} fallbackTitle={config.fallbackTitle} />
    </PageShell>
  )
}
