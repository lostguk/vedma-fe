import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { IconBag } from '../Icons'
import styles from './MobileCartFab.module.css'

const HIDDEN_PATHS = ['/checkout']

export default function MobileCartFab() {
	const location = useLocation()
	const { totalItems, openDrawer, drawerOpen } = useCart()
	const [bump, setBump] = useState(false)
	const prevTotalRef = useRef(null)

	useEffect(() => {
		if (prevTotalRef.current !== null && prevTotalRef.current !== totalItems) {
			setBump(true)
			const t = window.setTimeout(() => setBump(false), 450)
			prevTotalRef.current = totalItems
			return () => window.clearTimeout(t)
		}
		prevTotalRef.current = totalItems
		return undefined
	}, [totalItems])

	const hidden =
		drawerOpen || HIDDEN_PATHS.some(path => location.pathname.startsWith(path))

	if (hidden) return null

	return (
		<button
			type='button'
			className={styles.fab}
			onClick={openDrawer}
			aria-label='Корзина'
		>
			<IconBag size={22} />
			{totalItems > 0 && (
				<span className={`${styles.badge} ${bump ? styles.badgeBump : ''}`}>
					{totalItems > 99 ? '99+' : totalItems}
				</span>
			)}
		</button>
	)
}
