import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useFavorites } from '../../context/FavoritesContext'
import { IconHeart, IconX } from '../Icons'
import styles from './FavoritesToast.module.css'

export default function FavoritesToast() {
	const { toast, dismissToast } = useFavorites()

	useEffect(() => {
		if (!toast) return undefined
		const t = setTimeout(() => dismissToast(), 2500)
		return () => clearTimeout(t)
	}, [toast, dismissToast])

	if (!toast) return null

	return createPortal(
		<div className={styles.wrap} role='status'>
			<div className={styles.toast}>
				<span className={styles.icon}>
					<IconHeart size={14} fill='currentColor' />
				</span>
				<span className={styles.text}>
					<span className={styles.name}>{toast.name}</span> — в избранном
				</span>
				<Link to='/favorites' className={styles.goBtn} onClick={dismissToast}>
					Перейти
				</Link>
				<button
					type='button'
					className={styles.closeBtn}
					onClick={dismissToast}
					aria-label='Закрыть'
				>
					<IconX size={13} />
				</button>
			</div>
		</div>,
		document.body,
	)
}
