import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button } from '../ui'
import styles from './AgeGate.module.css'

const AGE_CONFIRM_STORAGE_KEY = 'vedmino-age-confirmed'

function hasAgeConfirmation() {
	return window.localStorage.getItem(AGE_CONFIRM_STORAGE_KEY) === '1'
}

function setAgeConfirmation() {
	window.localStorage.setItem(AGE_CONFIRM_STORAGE_KEY, '1')
}

export default function AgeGate() {
	const { pathname } = useLocation()
	const [visible, setVisible] = useState(false)
	const [leaving, setLeaving] = useState(false)

	useEffect(() => {
		if (pathname.startsWith('/verify-registration')) {
			setVisible(false)
			setLeaving(false)
			document.body.style.overflow = ''
			return
		}

		try {
			if (!hasAgeConfirmation()) {
				setVisible(true)
				document.body.style.overflow = 'hidden'
			}
		} catch {
			setVisible(true)
			document.body.style.overflow = 'hidden'
		}
	}, [pathname])

	const confirm = () => {
		setLeaving(true)
		try {
			setAgeConfirmation()
		} catch {
			/* noop */
		}
		setTimeout(() => {
			setVisible(false)
			document.body.style.overflow = ''
		}, 500)
	}

	if (!visible) return null

	return (
		<div
			className={`${styles.overlay} ${leaving ? styles.overlayLeaving : ''}`}
		>
			<div className={`${styles.card} ${leaving ? styles.cardLeaving : ''}`}>
				<img src='/images/age-gate-bg.png' alt='' className={styles.cardBg} />
				<div className={styles.cardBgDim} />

				<div className={styles.cardInner}>
					<div className={styles.logoWrap}>
						<span className={styles.logoMain}>Ведьмино</span>
						<span className={styles.logoAccent}>Зелье</span>
					</div>

					<div className={styles.divider}>
						<span className={styles.dividerLine} />
						<span className={styles.dividerSymbol}>&#10037;</span>
						<span className={styles.dividerLine} />
					</div>

					<h2 className={styles.title}>Добро пожаловать в мастерскую</h2>

					<p className={styles.text}>
						Наш магазин предлагает эзотерические товары, предназначенные для лиц
						старше 18 лет. Подтвердите свой возраст, чтобы войти.
					</p>

					<Button
						variant='primary'
						size='lg'
						className={styles.btn}
						onClick={confirm}
					>
						Мне есть 18 лет — Войти
					</Button>

					<p className={styles.note}>
						Нажимая «Войти», вы подтверждаете, что вам исполнилось 18 лет и вы
						соглашаетесь с условиями использования сайта.
					</p>
				</div>
			</div>
		</div>
	)
}
