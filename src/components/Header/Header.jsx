import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useFavorites } from '../../context/FavoritesContext'
import CartModal from '../CartModal/CartModal'
import { IconBag, IconHeart, IconSearch, IconUser, IconX } from '../Icons'
import LoginModal from '../LoginModal/LoginModal'
import CatalogDropdown from './CatalogDropdown'
import styles from './Header.module.css'
import MobileMenu from './MobileMenu'
import TopBar from './TopBar'

export default function Header() {
	const location = useLocation()
	const navigate = useNavigate()
	const { totalItems, openDrawer } = useCart()
	const { count: favCount } = useFavorites()
	const { isAuthenticated } = useAuth()
	const [badgeBump, setBadgeBump] = useState(false)
	const prevTotalRef = useRef(null)

	const [scrolled, setScrolled] = useState(false)
	const [menuOpen, setMenuOpen] = useState(false)
	const [loginOpen, setLoginOpen] = useState(false)
	const [catalogOpen, setCatalogOpen] = useState(false)
	const [search, setSearch] = useState(() => {
		const params = new URLSearchParams(window.location.search)
		return params.get('search') || ''
	})
	const catalogRef = useRef(null)

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 120)
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	useEffect(() => {
		if (prevTotalRef.current !== null && prevTotalRef.current !== totalItems) {
			setBadgeBump(true)
			const t = window.setTimeout(() => setBadgeBump(false), 450)
			prevTotalRef.current = totalItems
			return () => window.clearTimeout(t)
		}
		prevTotalRef.current = totalItems
		return undefined
	}, [totalItems])

	useEffect(() => {
		if (menuOpen) document.body.style.overflow = 'hidden'
		else if (!loginOpen) document.body.style.overflow = ''
		return () => {
			document.body.style.overflow = ''
		}
	}, [menuOpen, loginOpen])

	useEffect(() => {
		if (location.pathname === '/catalog') {
			const params = new URLSearchParams(location.search)
			setSearch(params.get('search') || '')
		} else {
			setSearch('')
		}
	}, [location])

	useEffect(() => {
		const onClick = e => {
			if (catalogRef.current && !catalogRef.current.contains(e.target))
				setCatalogOpen(false)
		}
		document.addEventListener('mousedown', onClick)
		return () => document.removeEventListener('mousedown', onClick)
	}, [])

	const navLinks = [
		{ label: 'Главная', to: '/', end: true },
		{ label: 'Каталог', to: '/catalog', catalogSection: true },
		{ label: 'Доставка и оплата', to: '/delivery' },
		{ label: 'Обмен и возврат', to: '/returns' },
		{ label: 'Контакты', to: '/contacts' },
	]

	const isNavItemActive = (link, isActiveFromNav) => {
		if (link.catalogSection) {
			const p = location.pathname
			return p === '/catalog' || p.startsWith('/product/')
		}
		return isActiveFromNav
	}

	return (
		<>
			<header className={styles.header}>
				<TopBar />

				<div
					className={`${styles.midBar} ${scrolled ? styles.midBarSticky : ''}`}
				>
					<div className={`container ${styles.midBarInner}`}>
						<Link to='/' className={styles.logo}>
							<span className={styles.logoMain}>Ведьмино</span>
							<span className={styles.logoAccent}>Зелье</span>
						</Link>

						<nav className={styles.midNav}>
							{navLinks.map(link => (
								<NavLink
									key={link.label}
									to={link.to}
									end={link.end ?? false}
									className={({ isActive }) =>
										`${styles.midNavLink} ${isNavItemActive(link, isActive) ? styles.midNavLinkActive : ''}`
									}
								>
									{link.label}
								</NavLink>
							))}
						</nav>

						<button
							className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
							onClick={() => setMenuOpen(!menuOpen)}
							aria-label='Меню'
						>
							<span />
							<span />
							<span />
						</button>
					</div>
				</div>

				<div
					className={`${styles.catBar} ${scrolled ? styles.catBarSticky : ''}`}
				>
					<div className={`container ${styles.catBarInner}`} ref={catalogRef}>
						<CatalogDropdown
							open={catalogOpen}
							onToggle={() => setCatalogOpen(!catalogOpen)}
							onClose={() => setCatalogOpen(false)}
							catalogRef={catalogRef}
						/>

						<div className={styles.catBarCenter}>
							<form
								className={styles.searchWrap}
								onSubmit={e => {
									e.preventDefault()
									const q = search.trim()
									if (q) {
										navigate(`/catalog?search=${encodeURIComponent(q)}`)
									} else {
										navigate('/catalog')
									}
									setCatalogOpen(false)
								}}
							>
								<input
									className={styles.searchInput}
									type='search'
									placeholder='Поиск свечей, зелий, артефактов...'
									value={search}
									onChange={e => setSearch(e.target.value)}
									enterKeyHint='search'
									autoCapitalize='none'
									autoCorrect='off'
									autoComplete='off'
								/>
								<button
									type='submit'
									className={styles.searchSubmit}
									aria-label='Найти'
								>
									<IconSearch size={14} />
								</button>
							</form>
							<button
								type='button'
								className={`${styles.searchClear} ${search ? styles.searchClearVisible : ''}`}
								onClick={() => {
									setSearch('')
									if (
										location.pathname === '/catalog' &&
										new URLSearchParams(location.search).has('search')
									) {
										navigate('/catalog')
									}
								}}
								aria-label='Очистить'
								tabIndex={search ? 0 : -1}
							>
								<IconX size={14} />
							</button>
						</div>

						<div className={styles.catBarActions}>
							{isAuthenticated ? (
								<Link
									to='/profile'
									className={styles.actionBtn}
									aria-label='Личный кабинет'
								>
									<IconUser size={18} />
									<span className={styles.actionLabel}>Кабинет</span>
								</Link>
							) : (
								<button
									className={styles.actionBtn}
									onClick={() => setLoginOpen(true)}
									aria-label='Войти'
								>
									<IconUser size={18} />
									<span className={styles.actionLabel}>Войти</span>
								</button>
							)}
							<Link
								to='/favorites'
								className={styles.actionBtn}
								aria-label='Избранное'
								title='Избранное'
							>
								<IconHeart size={18} />
								<span className={styles.actionLabel}>Избранное</span>
								{favCount > 0 && (
									<span className={styles.actionBadge}>
										{favCount > 99 ? '99+' : favCount}
									</span>
								)}
							</Link>
							<button
								className={styles.actionBtn}
								onClick={openDrawer}
								aria-label='Корзина'
							>
								<IconBag size={18} />
								<span className={styles.actionLabel}>Корзина</span>
								{totalItems > 0 && (
									<span
										className={`${styles.actionBadge} ${badgeBump ? styles.actionBadgeBump : ''}`}
									>
										{totalItems > 99 ? '99+' : totalItems}
									</span>
								)}
							</button>
						</div>
					</div>
				</div>
			</header>

			<MobileMenu
				open={menuOpen}
				onClose={() => setMenuOpen(false)}
				navLinks={navLinks}
				isNavItemActive={isNavItemActive}
				favCount={favCount}
				totalItems={totalItems}
				onLoginOpen={() => setLoginOpen(true)}
				onCartOpen={openDrawer}
			/>

			<LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
			<CartModal />
		</>
	)
}
