import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct } from '../../api/products'
import {
	IconBag,
	IconCheck,
	IconStar,
	IconTruck,
	IconUser,
} from '../../components/Icons'
import ProductGallery from '../../components/ProductGallery/ProductGallery'
import ProductCard from '../../components/ProductSection/ProductCard'
import {
	Breadcrumbs,
	Button,
	FavoriteButton,
	PageShell,
} from '../../components/ui'
import { useCart } from '../../context/CartContext'
import styles from './ProductPage.module.css'

function formatPrice(n) {
	return Number(n).toLocaleString('ru-RU')
}

export default function ProductPage() {
	const { slug } = useParams()
	const { addToCart, getItemQty } = useCart()

	const [product, setProduct] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [qty, setQty] = useState(1)
	const [justAdded, setJustAdded] = useState(false)
	const [activeTab, setActiveTab] = useState('description')
	const addedTimerRef = useRef(null)

	useEffect(() => {
		setLoading(true)
		setError(false)
		setQty(1)
		setActiveTab('description')

		getProduct(slug)
			.then(res => {
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
				<div
					style={{
						textAlign: 'center',
						padding: '6rem 0',
						color: 'var(--color-text-muted)',
					}}
				>
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
					<Button as={Link} to='/catalog' variant='primary' size='md'>
						Вернуться в каталог
					</Button>
				</div>
			</PageShell>
		)
	}

	const productId = String(product.id)
	const oldPrice = product.old_price
	const discount = oldPrice
		? Math.round((1 - product.price / oldPrice) * 100)
		: null
	const images = product.images_urls?.length
		? product.images_urls
		: [product.image_url].filter(Boolean)
	const related = product.related || []
	const inStock = product.in_stock !== false
	const stock = typeof product.stock === 'number' ? product.stock : null
	const inCartQty = getItemQty(productId)
	// Сколько ещё можно добавить с учётом уже лежащего в корзине (null = без лимита)
	const maxAddable = stock !== null ? Math.max(0, stock - inCartQty) : null
	const canAdd = maxAddable === null || maxAddable > 0
	const effectiveQty =
		maxAddable !== null ? Math.min(qty, Math.max(1, maxAddable)) : qty
	const tag = product.is_bestseller
		? 'Хит продаж'
		: product.is_new
			? 'Новинка'
			: null

	const breadcrumbs = [
		{ label: 'Главная', to: '/' },
		{ label: 'Каталог', to: '/catalog' },
	]
	if (product.breadcrumbs) {
		product.breadcrumbs.forEach(bc => {
			if (bc.type === 'category') {
				breadcrumbs.push({ label: bc.name, to: `/catalog?category=${bc.slug}` })
			}
		})
	}
	breadcrumbs.push({ label: product.name })

	const categoryLabel =
		product.categories?.map(c => c.name).join(' / ') || 'Каталог'

	return (
		<PageShell>
			<Breadcrumbs items={breadcrumbs} />

			<div className={styles.main}>
				<ProductGallery
					images={images}
					productName={product.name}
					tag={tag}
					discountPercent={discount}
				/>

				<div className={styles.info}>
					<span className={styles.category}>{categoryLabel}</span>
					<div className={styles.titleRow}>
						<h1 className={styles.title}>{product.name}</h1>
						<FavoriteButton
							productId={productId}
							productName={product.name}
							size='md'
						/>
					</div>

					<div className={styles.priceRow}>
						<div className={styles.priceBlock}>
							{oldPrice && (
								<span className={styles.oldPrice}>
									{formatPrice(oldPrice)} ₽
								</span>
							)}
							<span className={styles.price}>
								{formatPrice(product.price)} ₽
							</span>
						</div>
						{discount && oldPrice && (
							<span className={styles.saveBadge}>
								Выгода {formatPrice(oldPrice - product.price)} ₽
							</span>
						)}
					</div>

					{product.description ? (
						<div
							className={styles.desc}
							dangerouslySetInnerHTML={{ __html: product.description }}
						/>
					) : null}

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
									<button
										type='button'
										className={styles.qtyBtn}
										onClick={() => setQty(q => Math.max(1, q - 1))}
									>
										−
									</button>
									<span className={styles.qtyVal}>{effectiveQty}</span>
									<button
										type='button'
										className={styles.qtyBtn}
										disabled={maxAddable !== null && effectiveQty >= maxAddable}
										onClick={() =>
											setQty(q =>
												maxAddable !== null
													? Math.min(q + 1, maxAddable)
													: q + 1,
											)
										}
									>
										+
									</button>
								</div>
								<button
									type='button'
									className={`${styles.addToCart} ${justAdded ? styles.addToCartAdded : ''}`}
									disabled={justAdded || !canAdd}
									onClick={() => {
										addToCart(product, effectiveQty)
										setJustAdded(true)
										if (addedTimerRef.current)
											window.clearTimeout(addedTimerRef.current)
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
									) : !canAdd ? (
										'Всё в корзине'
									) : (
										<>
											<IconBag size={18} />В корзину —{' '}
											{formatPrice(product.price * effectiveQty)} ₽
										</>
									)}
								</button>
							</>
						) : (
							<div className={styles.outOfStock}>Нет в наличии</div>
						)}
					</div>
					{inStock && stock !== null && (
						<p className={styles.stockHint}>
							{maxAddable > 0
								? `На складе: ${stock} шт.${inCartQty > 0 ? ` (в корзине: ${inCartQty})` : ''}`
								: 'Вы добавили всё доступное количество в корзину'}
						</p>
					)}
				</div>
			</div>

			<div className={styles.tabs}>
				<div className={styles.tabList}>
					<button
						className={`${styles.tab} ${activeTab === 'description' ? styles.tabActive : ''}`}
						onClick={() => setActiveTab('description')}
					>
						Описание
					</button>
					<button
						className={`${styles.tab} ${activeTab === 'delivery' ? styles.tabActive : ''}`}
						onClick={() => setActiveTab('delivery')}
					>
						Доставка
					</button>
					{/*<button*/}
					{/*	className={`${styles.tab} ${activeTab === 'reviews' ? styles.tabActive : ''}`}*/}
					{/*	onClick={() => setActiveTab('reviews')}*/}
					{/*>*/}
					{/*	Отзывы*/}
					{/*</button>*/}
				</div>
				<div className={styles.tabContent}>
					{activeTab === 'description' && product.description ? (
						<div dangerouslySetInnerHTML={{ __html: product.description }} />
					) : null}
					{activeTab === 'delivery' && (
						<div>
							<p>
								<strong>Доставка по России:</strong> от 3 рабочих дней
							</p>
							<p>
								<strong>Стоимость:</strong> от 350 ₽ (бесплатно от 5 000 ₽)
							</p>
							<p>
								<strong>Самовывоз:</strong> по предварительному согласованию
							</p>
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
