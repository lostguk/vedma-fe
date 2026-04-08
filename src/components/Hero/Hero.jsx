import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'
import styles from './Hero.module.css'

const AUTO_INTERVAL = 5000
const PRELOAD_TIMEOUT = 8000

function preloadImages(slides) {
	const srcs = slides.map(s => s.image).filter(Boolean)
	if (!srcs.length) return Promise.resolve()
	return Promise.all(
		srcs.map(
			src =>
				new Promise(resolve => {
					const img = new Image()
					img.onload = resolve
					img.onerror = resolve
					img.src = src
				}),
		),
	)
}

export default function Hero({ slides: propSlides }) {
	const hasApiSlides = propSlides?.length > 0
	const [active, setActive] = useState(0)
	const [paused, setPaused] = useState(false)
	const [ready, setReady] = useState(false)
	const timerRef = useRef(null)

	useEffect(() => {
		if (!hasApiSlides) {
			setReady(false)
			return
		}
		let cancelled = false

		const timeout = setTimeout(() => {
			if (!cancelled) setReady(true)
		}, PRELOAD_TIMEOUT)

		preloadImages(propSlides).then(() => {
			if (!cancelled) setReady(true)
		})

		return () => {
			cancelled = true
			clearTimeout(timeout)
		}
	}, [hasApiSlides, propSlides])

	const slides = hasApiSlides ? propSlides : []
	const slide = slides[active] || slides[0]

	const goTo = useCallback(idx => setActive(idx), [])

	const next = useCallback(() => {
		setActive(prev => (prev + 1) % (slides.length || 1))
	}, [slides.length])

	const prev = useCallback(() => {
		setActive(prev => (prev - 1 + (slides.length || 1)) % (slides.length || 1))
	}, [slides.length])

	useEffect(() => {
		if (paused || slides.length <= 1 || !ready) return
		timerRef.current = setInterval(next, AUTO_INTERVAL)
		return () => clearInterval(timerRef.current)
	}, [paused, next, slides.length, ready])

	return (
		<section
			className={`${styles.hero} ${ready ? styles.heroReady : ''}`}
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			<div className={styles.loader}>
				<div className={styles.loaderRing} />
				<span className={styles.loaderText}>Ведьмино Зелье</span>
			</div>

			{ready && (
				<>
					<div className={styles.slides}>
						{slides.map((s, i) => (
							<div
								key={s.id || i}
								className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
							>
								{s.image && (
									<img
										src={s.image}
										alt={s.title}
										className={styles.slideImg}
										draggable={false}
									/>
								)}
								<div className={styles.slideOverlay} />
							</div>
						))}
					</div>

					<div className={`container ${styles.content}`}>
						<div className={styles.textBlock} key={active}>
							<h2 className={styles.title}>
								{slide.title}
								{slide.accent && (
									<span className={styles.titleAccent}> {slide.accent}</span>
								)}
							</h2>
							{slide.subtitle && (
								<p className={styles.subtitle}>{slide.subtitle}</p>
							)}
							{slide.button_text && slide.button_url && (
								<Button
									as={Link}
									to={slide.button_url}
									variant='primary'
									size='lg'
									className={styles.cta}
								>
									{slide.button_text}
									<span className={styles.ctaArrow}>&rarr;</span>
								</Button>
							)}
						</div>
					</div>

					{slides.length > 1 && (
						<>
							<button
								className={`${styles.arrow} ${styles.arrowLeft}`}
								onClick={prev}
								aria-label='Предыдущий слайд'
							>
								<svg
									width='20'
									height='20'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2.5'
									strokeLinecap='round'
									strokeLinejoin='round'
								>
									<path d='M15 18l-6-6 6-6' />
								</svg>
							</button>
							<button
								className={`${styles.arrow} ${styles.arrowRight}`}
								onClick={next}
								aria-label='Следующий слайд'
							>
								<svg
									width='20'
									height='20'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2.5'
									strokeLinecap='round'
									strokeLinejoin='round'
								>
									<path d='M9 18l6-6-6-6' />
								</svg>
							</button>

							<div className={styles.dots}>
								{slides.map((_, i) => (
									<button
										key={i}
										className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
										onClick={() => goTo(i)}
										aria-label={`Слайд ${i + 1}`}
									>
										{i === active && (
											<span
												className={styles.dotProgress}
												style={{
													animationDuration: `${AUTO_INTERVAL}ms`,
													animationPlayState: paused ? 'paused' : 'running',
												}}
											/>
										)}
									</button>
								))}
							</div>
						</>
					)}
				</>
			)}
		</section>
	)
}
