import { useCallback, useRef, useState } from 'react'
import { IconChevronLeft, IconChevronRight } from '../Icons'
import Lightbox from '../Lightbox/Lightbox'
import { LazyImage } from '../ui'
import styles from './ProductGallery.module.css'

const SWIPE_THRESHOLD = 50

export default function ProductGallery({
	images = [],
	productName = '',
	tag,
	discountPercent,
}) {
	const [activeIndex, setActiveIndex] = useState(0)
	const [lightboxOpen, setLightboxOpen] = useState(false)
	const touchRef = useRef({ startX: 0, startY: 0, swiping: false })

	const total = images.length
	const hasMultiple = total > 1

	const goTo = useCallback(idx => {
		setActiveIndex(idx)
	}, [])

	const goPrev = useCallback(() => {
		setActiveIndex(i => (i - 1 + total) % total)
	}, [total])

	const goNext = useCallback(() => {
		setActiveIndex(i => (i + 1) % total)
	}, [total])

	const handleTouchStart = useCallback(e => {
		const touch = e.touches[0]
		touchRef.current = {
			startX: touch.clientX,
			startY: touch.clientY,
			swiping: true,
		}
	}, [])

	const handleTouchEnd = useCallback(
		e => {
			if (!touchRef.current.swiping) return
			const touch = e.changedTouches[0]
			const diffX = touch.clientX - touchRef.current.startX
			const diffY = Math.abs(touch.clientY - touchRef.current.startY)

			if (Math.abs(diffX) > SWIPE_THRESHOLD && diffY < Math.abs(diffX)) {
				if (diffX < 0) goNext()
				else goPrev()
			}
			touchRef.current.swiping = false
		},
		[goNext, goPrev],
	)

	const handleMainClick = useCallback(() => {
		setLightboxOpen(true)
	}, [])

	if (!images.length) return null

	return (
		<div className={styles.gallery}>
			<div
				className={styles.mainImageWrap}
				onTouchStart={hasMultiple ? handleTouchStart : undefined}
				onTouchEnd={hasMultiple ? handleTouchEnd : undefined}
				onClick={handleMainClick}
			>
				<div className={styles.mainImageInner}>
					{images.map((url, i) => (
						<div
							key={url}
							className={`${styles.slide} ${i === activeIndex ? styles.slideActive : ''}`}
						>
							<LazyImage
								src={url}
								alt={`${productName}${total > 1 ? ` ${i + 1}` : ''}`}
								className={styles.slideImage}
								aspectRatio='1'
							/>
						</div>
					))}
				</div>

				{tag && <span className={styles.tag}>{tag}</span>}
				{discountPercent && (
					<span className={styles.discount}>&minus;{discountPercent}%</span>
				)}

				{hasMultiple && (
					<>
						<button
							type='button'
							className={`${styles.arrow} ${styles.arrowPrev}`}
							onClick={e => {
								e.stopPropagation()
								goPrev()
							}}
							aria-label='Предыдущее изображение'
						>
							<IconChevronLeft size={20} />
						</button>
						<button
							type='button'
							className={`${styles.arrow} ${styles.arrowNext}`}
							onClick={e => {
								e.stopPropagation()
								goNext()
							}}
							aria-label='Следующее изображение'
						>
							<IconChevronRight size={20} />
						</button>
						<span className={styles.counter}>
							{activeIndex + 1} / {total}
						</span>
					</>
				)}
			</div>

			{hasMultiple && (
				<>
					<div className={styles.thumbs}>
						{images.map((url, i) => (
							<button
								key={url}
								type='button'
								className={`${styles.thumb} ${i === activeIndex ? styles.thumbActive : ''}`}
								onClick={() => goTo(i)}
								aria-label={`Изображение ${i + 1}`}
							>
								<img
									src={url}
									alt=''
									className={styles.thumbImg}
									loading='lazy'
								/>
							</button>
						))}
					</div>

					<div className={styles.dots}>
						{images.map((url, i) => (
							<button
								key={url}
								type='button'
								className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
								onClick={() => goTo(i)}
								aria-label={`Изображение ${i + 1}`}
							/>
						))}
					</div>
				</>
			)}

			{lightboxOpen && (
				<Lightbox
					images={images}
					startIndex={activeIndex}
					onClose={() => setLightboxOpen(false)}
				/>
			)}
		</div>
	)
}
