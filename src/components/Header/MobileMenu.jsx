import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { getCategories } from '../../api/categories'
import { IconChevronDown } from '../Icons'
import styles from './Header.module.css'

function MobileCatalogItem({ item, onClose }) {
	const [open, setOpen] = useState(false)
	const hasChildren = item.children && item.children.length > 0

	if (!hasChildren) {
		return (
			<Link to={item.href} className={styles.mobileNavLink} onClick={onClose}>
				{item.label}
			</Link>
		)
	}

	return (
		<div className={styles.mobileAccordion}>
			<button
				className={styles.mobileAccordionToggle}
				onClick={() => setOpen(!open)}
			>
				{item.label}
				<IconChevronDown
					size={14}
					className={`${styles.mobileAccordionArrow} ${open ? styles.mobileAccordionArrowOpen : ''}`}
				/>
			</button>
			{open && (
				<div className={styles.mobileAccordionContent}>
					<Link
						to={item.href}
						className={styles.mobileAccordionLink}
						onClick={onClose}
					>
						Все {item.label.toLowerCase()}
					</Link>
					{item.children.map(child => (
						<Link
							key={child.label}
							to={child.href}
							className={styles.mobileAccordionLink}
							onClick={onClose}
						>
							{child.label}
						</Link>
					))}
				</div>
			)}
		</div>
	)
}

export default function MobileMenu({
	open,
	onClose,
	navLinks,
	isNavItemActive,
	favCount,
	totalItems,
	onLoginOpen,
	onCartOpen,
}) {
	const [catalogItems, setCatalogItems] = useState([])

	useEffect(() => {
		getCategories()
			.then(res => {
				const data = res.data?.data ?? res.data
				const cats = Array.isArray(data) ? data : []
				setCatalogItems([
					{ label: 'Все товары', href: '/catalog' },
					...cats.map(c => ({
						label: c.name,
						href: `/catalog?category=${c.slug}`,
						children: c.children?.map(ch => ({
							label: ch.name,
							href: `/catalog?category=${ch.slug}`,
						})),
					})),
				])
			})
			.catch(() => setCatalogItems([{ label: 'Все товары', href: '/catalog' }]))
	}, [])

	return (
		<div className={`${styles.mobileNav} ${open ? styles.mobileNavOpen : ''}`}>
			<div className={styles.mobileNavContent}>
				<div className={styles.mobileNavSection}>
					<span className={styles.mobileNavSectionTitle}>Каталог</span>
					{catalogItems.map(item => (
						<MobileCatalogItem key={item.label} item={item} onClose={onClose} />
					))}
				</div>
				<div className={styles.mobileNavDivider} />
				<Link
					to='/favorites'
					className={styles.mobileNavTopLink}
					onClick={onClose}
				>
					Избранное
					{favCount > 0 && (
						<span className={styles.mobileFavCount}> {favCount}</span>
					)}
				</Link>
				<button
					type='button'
					className={styles.mobileNavTopLink}
					onClick={() => {
						onClose()
						onCartOpen()
					}}
				>
					Корзина
					{totalItems > 0 && (
						<span className={styles.mobileFavCount}> {totalItems}</span>
					)}
				</button>
				<div className={styles.mobileNavDivider} />
				{navLinks.map(link => (
					<NavLink
						key={link.label}
						to={link.to}
						end={link.end ?? false}
						className={({ isActive }) =>
							`${styles.mobileNavTopLink} ${isNavItemActive(link, isActive) ? styles.mobileNavTopLinkActive : ''}`
						}
						onClick={onClose}
					>
						{link.label}
					</NavLink>
				))}
				<div className={styles.mobileNavDivider} />
				<div className={styles.mobileNavInfo}>
					<a href='tel:+79001234567' className={styles.mobileNavInfoItem}>
						+7 (900) 123-45-67
					</a>
					<span className={styles.mobileNavInfoItem}>
						Ежедневно 10:00–21:00
					</span>
				</div>
				<button
					className={styles.mobileNavLoginBtn}
					onClick={() => {
						onClose()
						onLoginOpen()
					}}
				>
					Войти
				</button>
			</div>
		</div>
	)
}
