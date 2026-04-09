import { useCallback, useEffect, useRef, useState } from 'react'
import { useFavorites } from '../../../context/FavoritesContext'
import { IconHeart } from '../../Icons'
import styles from './FavoriteButton.module.css'

const SPARK_COUNT = 6
const sparks = Array.from({ length: SPARK_COUNT })

const sizeConfig = {
	sm: { icon: 15, strokeWidth: 1.5 },
	md: { icon: 20, strokeWidth: 1.6 },
}

export default function FavoriteButton({
	productId,
	productName,
	size = 'sm',
	className = '',
}) {
	const { isFavorite, toggleFavorite } = useFavorites()
	const favorite = isFavorite(productId)

	const [bursting, setBursting] = useState(false)
	const [sparking, setSparking] = useState(false)
	const wasFavoriteRef = useRef(favorite)
	const burstTimer = useRef(null)
	const sparkTimer = useRef(null)

	useEffect(() => {
		if (favorite && !wasFavoriteRef.current) {
			setBursting(true)
			setSparking(true)

			burstTimer.current = setTimeout(() => setBursting(false), 550)
			sparkTimer.current = setTimeout(() => setSparking(false), 600)
		}
		wasFavoriteRef.current = favorite
	}, [favorite])

	useEffect(() => {
		return () => {
			if (burstTimer.current) clearTimeout(burstTimer.current)
			if (sparkTimer.current) clearTimeout(sparkTimer.current)
		}
	}, [])

	const handleClick = useCallback(
		e => {
			e.preventDefault()
			e.stopPropagation()
			toggleFavorite(productId, productName)
		},
		[productId, productName, toggleFavorite],
	)

	const { icon, strokeWidth } = sizeConfig[size] || sizeConfig.sm

	const btnClasses = [
		styles.btn,
		styles[size],
		favorite ? styles.active : '',
		bursting ? styles.burst : '',
	]
		.filter(Boolean)
		.join(' ')

	const wrapClasses = [styles.wrap, className].filter(Boolean).join(' ')

	return (
		<span className={wrapClasses} data-active={favorite || undefined}>
			<button
				type='button'
				className={btnClasses}
				onClick={handleClick}
				aria-label={favorite ? 'Убрать из избранного' : 'В избранное'}
				aria-pressed={favorite}
			>
				<IconHeart
					size={icon}
					strokeWidth={strokeWidth}
					fill={favorite ? 'currentColor' : 'none'}
					className={styles.heart}
				/>
			</button>
			<span
				className={`${styles.sparkles} ${sparking ? styles.animating : ''}`}
			>
				{sparks.map((_, i) => (
					<span key={i} className={styles.spark} />
				))}
			</span>
		</span>
	)
}
