import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCategories } from '../../api/categories'
import { getProducts } from '../../api/products'
import {
	IconChevronDown,
	IconChevronLeft,
	IconChevronRight,
	IconFilter,
	IconSearch,
} from '../../components/Icons'
import ProductCard from '../../components/ProductSection/ProductCard'
import ProductCardSkeleton from '../../components/ProductSection/ProductCardSkeleton'
import { Breadcrumbs, EmptyState, PageShell } from '../../components/ui'
import styles from './CatalogPage.module.css'

const SORT_OPTIONS = [
	{ id: 'created_at_desc', label: 'По новизне' },
	{ id: 'price_asc', label: 'Сначала дешевле' },
	{ id: 'price_desc', label: 'Сначала дороже' },
	{ id: 'name_asc', label: 'По названию А-Я' },
]

const PER_PAGE = 30

function SidebarCategory({ cat, active, onSelect }) {
	const [open, setOpen] = useState(false)
	const hasChildren = cat.children && cat.children.length > 0
	const isParentActive =
		active === cat.slug ||
		(hasChildren && cat.children.some(c => c.slug === active))

	return (
		<li>
			<div className={styles.catRow}>
				<button
					className={`${styles.catBtn} ${active === cat.slug ? styles.catBtnActive : ''} ${isParentActive && active !== cat.slug ? styles.catBtnParentActive : ''}`}
					onClick={() => onSelect(cat.slug)}
				>
					<span>{cat.name}</span>
				</button>
				{hasChildren && (
					<button
						className={`${styles.catToggle} ${open || isParentActive ? styles.catToggleOpen : ''}`}
						onClick={() => setOpen(!open)}
						aria-label='Раскрыть'
					>
						<IconChevronDown size={12} />
					</button>
				)}
			</div>
			{hasChildren && (open || isParentActive) && (
				<ul className={styles.catSubList}>
					{cat.children.map(sub => (
						<li key={sub.id}>
							<button
								className={`${styles.catSubBtn} ${active === sub.slug ? styles.catSubBtnActive : ''}`}
								onClick={() => onSelect(sub.slug)}
							>
								<span>{sub.name}</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</li>
	)
}

export default function CatalogPage() {
	const [searchParams, setSearchParams] = useSearchParams()
	const [products, setProducts] = useState([])
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(true)
	const [total, setTotal] = useState(0)
	const [totalPages, setTotalPages] = useState(0)
	const [filtersOpen, setFiltersOpen] = useState(false)
	const [minPrice, setMinPrice] = useState(0)
	const [maxPrice, setMaxPrice] = useState(50000)
	const [priceRangeReady, setPriceRangeReady] = useState(false)
	const [localPriceFrom, setLocalPriceFrom] = useState('')
	const [localPriceTo, setLocalPriceTo] = useState('')
	const rangeTimerRef = useRef(null)

	const activeCategory = searchParams.get('category') || ''
	const sort = searchParams.get('sort') || 'created_at_desc'
	const page = parseInt(searchParams.get('page') || '1', 10)
	const priceFrom = searchParams.get('price_from') || ''
	const priceTo = searchParams.get('price_to') || ''
	const search = searchParams.get('search') || ''

	const updateParam = useCallback(
		(key, value) => {
			setSearchParams(prev => {
				const next = new URLSearchParams(prev)
				if (value) {
					next.set(key, value)
				} else {
					next.delete(key)
				}
				if (key !== 'page') next.delete('page')
				return next
			})
		},
		[setSearchParams],
	)

	useEffect(() => {
		setLocalPriceFrom(priceFrom)
		setLocalPriceTo(priceTo)
	}, [priceFrom, priceTo])

	useEffect(() => {
		getCategories()
			.then(res => {
				const data = res.data?.data ?? res.data
				setCategories(Array.isArray(data) ? data : [])
			})
			.catch(() => setCategories([]))

		getProducts({ per_page: 100, sort: 'price_asc' })
			.then(res => {
				const items = res.data?.data || []
				if (items.length) {
					const prices = items.map(p => p.price).filter(Boolean)
					setMinPrice(Math.floor(Math.min(...prices) / 100) * 100)
					setMaxPrice(Math.ceil(Math.max(...prices) / 100) * 100)
					setPriceRangeReady(true)
				}
			})
			.catch(() => {})
	}, [])

	useEffect(() => {
		setLoading(true)
		const params = { per_page: PER_PAGE, page, sort }
		if (activeCategory) params.category = activeCategory
		if (priceFrom) params.price_from = priceFrom
		if (priceTo) params.price_to = priceTo
		if (search) params.search = search

		getProducts(params)
			.then(res => {
				const raw = res.data
				const items = raw.data || []
				setProducts(items)
				setTotal(raw.meta?.total ?? items.length ?? 0)
				setTotalPages(raw.meta?.last_page ?? 1)
				if (!priceRangeReady && items.length) {
					const prices = items.map(p => p.price).filter(Boolean)
					if (prices.length) {
						const min = Math.floor(Math.min(...prices) / 100) * 100
						const max = Math.ceil(Math.max(...prices) / 100) * 100
						setMinPrice(min)
						setMaxPrice(max)
						setPriceRangeReady(true)
					}
				}
			})
			.catch(() => {
				setProducts([])
				setTotal(0)
				setTotalPages(0)
			})
			.finally(() => setLoading(false))
	}, [activeCategory, sort, page, priceFrom, priceTo, search])

	const handleSelectCategory = slug => {
		updateParam('category', activeCategory === slug ? '' : slug)
		setFiltersOpen(false)
	}

	const resetFilters = () => {
		setSearchParams({})
	}

	return (
		<PageShell className={styles.shell}>
			<div className={styles.container}>
				<Breadcrumbs
					items={[{ label: 'Главная', to: '/' }, { label: 'Каталог' }]}
				/>

				<div className={styles.pageHeader}>
					<div>
						<h1 className={styles.pageTitle}>
							{search ? `Поиск: «${search}»` : 'Каталог'}
						</h1>
						<p className={styles.pageCount}>
							{loading ? 'Загрузка...' : `${total} ${declension(total)}`}
							{search && !loading && (
								<button
									type='button'
									className={styles.resetSearchBtn}
									onClick={() => updateParam('search', '')}
								>
									Сбросить поиск
								</button>
							)}
						</p>
					</div>
					<div className={styles.headerControls}>
						<button
							className={styles.mobileFilterBtn}
							onClick={() => setFiltersOpen(!filtersOpen)}
						>
							<IconFilter size={16} />
							Фильтры
						</button>
						<div className={styles.sortWrap}>
							<select
								className={styles.sortSelect}
								value={sort}
								onChange={e => updateParam('sort', e.target.value)}
							>
								{SORT_OPTIONS.map(opt => (
									<option key={opt.id} value={opt.id}>
										{opt.label}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				<div className={styles.layout}>
					<aside
						className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ''}`}
					>
						<div className={styles.sidebarSection}>
							<h3 className={styles.sidebarTitle}>Категории</h3>
							<ul className={styles.catList}>
								<li>
									<button
										className={`${styles.catBtn} ${!activeCategory ? styles.catBtnActive : ''}`}
										onClick={() => updateParam('category', '')}
									>
										Все товары
									</button>
								</li>
								{categories.map(cat => (
									<SidebarCategory
										key={cat.id}
										cat={cat}
										active={activeCategory}
										onSelect={handleSelectCategory}
									/>
								))}
							</ul>
						</div>

						<div className={styles.sidebarSection}>
							<h3 className={styles.sidebarTitle}>Цена, ₽</h3>
							<div className={styles.priceInputs}>
								<input
									type='number'
									className={styles.priceInput}
									placeholder={priceRangeReady ? String(minPrice) : 'От'}
									value={localPriceFrom}
									onChange={e => {
										setLocalPriceFrom(e.target.value)
										updateParam('price_from', e.target.value)
									}}
								/>
								<span className={styles.priceDash}>—</span>
								<input
									type='number'
									className={styles.priceInput}
									placeholder={priceRangeReady ? String(maxPrice) : 'До'}
									value={localPriceTo}
									onChange={e => {
										setLocalPriceTo(e.target.value)
										updateParam('price_to', e.target.value)
									}}
								/>
							</div>
							<div className={styles.rangeSlider}>
								<div
									className={styles.rangeTrackFill}
									style={{
										left: `${(((Number(localPriceFrom) || minPrice) - minPrice) / (maxPrice - minPrice)) * 100}%`,
										right: `${100 - (((Number(localPriceTo) || maxPrice) - minPrice) / (maxPrice - minPrice)) * 100}%`,
									}}
								/>
								<input
									type='range'
									className={styles.rangeInput}
									min={minPrice}
									max={maxPrice}
									value={Number(localPriceFrom) || minPrice}
									onChange={e => {
										const v = Math.min(
											+e.target.value,
											(Number(localPriceTo) || maxPrice) - 50,
										)
										setLocalPriceFrom(v > 0 ? String(v) : '')
									}}
									onMouseUp={() => {
										clearTimeout(rangeTimerRef.current)
										rangeTimerRef.current = setTimeout(() => {
											updateParam('price_from', localPriceFrom)
										}, 200)
									}}
									onTouchEnd={() => {
										clearTimeout(rangeTimerRef.current)
										rangeTimerRef.current = setTimeout(() => {
											updateParam('price_from', localPriceFrom)
										}, 200)
									}}
								/>
								<input
									type='range'
									className={styles.rangeInput}
									min={minPrice}
									max={maxPrice}
									value={Number(localPriceTo) || maxPrice}
									onChange={e => {
										const v = Math.max(
											+e.target.value,
											(Number(localPriceFrom) || 0) + 50,
										)
										setLocalPriceTo(v < maxPrice ? String(v) : '')
									}}
									onMouseUp={() => {
										clearTimeout(rangeTimerRef.current)
										rangeTimerRef.current = setTimeout(() => {
											updateParam('price_to', localPriceTo)
										}, 200)
									}}
									onTouchEnd={() => {
										clearTimeout(rangeTimerRef.current)
										rangeTimerRef.current = setTimeout(() => {
											updateParam('price_to', localPriceTo)
										}, 200)
									}}
								/>
							</div>
						</div>

						<button
							className={styles.sidebarClose}
							onClick={() => setFiltersOpen(false)}
						>
							Применить
						</button>
					</aside>

					<div className={styles.content}>
						{loading && (
							<div className={styles.grid}>
								{Array.from({ length: PER_PAGE }).map((_, i) => (
									<ProductCardSkeleton key={i} />
								))}
							</div>
						)}

						{!loading && products.length === 0 && (
							<EmptyState
								icon={<IconSearch size={56} strokeWidth={1} />}
								title='Товары не найдены'
								description='Попробуйте изменить параметры фильтра'
								actionLabel='Сбросить фильтры'
								onAction={resetFilters}
							/>
						)}

						{!loading && products.length > 0 && (
							<>
								<div className={styles.grid}>
									{products.map(product => (
										<ProductCard key={product.id} product={product} />
									))}
								</div>

								{totalPages > 1 && (
									<div className={styles.pagination}>
										<button
											className={styles.pageBtn}
											disabled={page === 1}
											onClick={() => updateParam('page', String(page - 1))}
										>
											<IconChevronLeft size={16} />
										</button>

										{getPaginationItems(page, totalPages).map((item, idx) =>
											item === 'ellipsis' ? (
												<span
													key={`ellipsis-${idx}`}
													className={styles.pageEllipsis}
													aria-hidden='true'
												>
													…
												</span>
											) : (
												<button
													key={item}
													className={`${styles.pageNum} ${item === page ? styles.pageNumActive : ''}`}
													onClick={() => updateParam('page', String(item))}
												>
													{item}
												</button>
											),
										)}

										<button
											className={styles.pageBtn}
											disabled={page === totalPages}
											onClick={() => updateParam('page', String(page + 1))}
										>
											<IconChevronRight size={16} />
										</button>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</PageShell>
	)
}

function getPaginationItems(current, total) {
	if (total <= 7) {
		return Array.from({ length: total }, (_, i) => i + 1)
	}

	const pages = new Set([1, total, current])

	for (let i = current - 1; i <= current + 1; i++) {
		if (i >= 1 && i <= total) pages.add(i)
	}

	if (current <= 4) {
		for (let i = 1; i <= 5; i++) pages.add(i)
	}

	if (current >= total - 3) {
		for (let i = total - 4; i <= total; i++) pages.add(i)
	}

	const sorted = [...pages]
		.filter(n => n >= 1 && n <= total)
		.sort((a, b) => a - b)
	const items = []

	sorted.forEach((n, index) => {
		if (index > 0 && n - sorted[index - 1] > 1) {
			items.push('ellipsis')
		}
		items.push(n)
	})

	return items
}

function declension(n) {
	const abs = Math.abs(n) % 100
	const last = abs % 10
	if (abs > 10 && abs < 20) return 'товаров'
	if (last > 1 && last < 5) return 'товара'
	if (last === 1) return 'товар'
	return 'товаров'
}
