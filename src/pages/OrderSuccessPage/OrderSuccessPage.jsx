import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { IconArrowRight, IconMail, IconTruck } from '../../components/Icons'
import { Button, GlassCard } from '../../components/ui'
import { useCart } from '../../context/CartContext'
import {
	isPendingStatus,
	usePaymentReturnVerification,
} from '../../hooks/usePaymentReturnVerification'
import styles from './OrderSuccessPage.module.css'

function Particle({ delay, left, size, duration }) {
	return (
		<div
			className={styles.particle}
			style={{
				'--delay': `${delay}s`,
				'--left': `${left}%`,
				'--size': `${size}px`,
				'--dur': `${duration}s`,
			}}
		/>
	)
}

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
	id: i,
	delay: Math.random() * 6,
	left: Math.random() * 100,
	size: 3 + Math.random() * 5,
	duration: 4 + Math.random() * 5,
}))

export default function OrderSuccessPage() {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const paymentId = searchParams.get('payment')
	const orderId = searchParams.get('order_id')

	const { phase, payment } = usePaymentReturnVerification(paymentId)
	const { clearCart } = useCart()
	const [show, setShow] = useState(false)
	const [step, setStep] = useState(0)
	const timerRef = useRef(null)

	useEffect(() => {
		if (paymentId) return
		clearCart()
	}, [clearCart, paymentId])

	useEffect(() => {
		if (!paymentId) return
		if (phase === 'ready' && payment?.status === 'paid') {
			clearCart()
		}
	}, [clearCart, paymentId, phase, payment])

	useEffect(() => {
		if (phase !== 'ready' || !paymentId || !payment) return
		if (payment.status === 'failed') {
			const p = new URLSearchParams()
			p.set('payment', paymentId)
			if (orderId) p.set('order_id', orderId)
			navigate(`/payment-error?${p.toString()}`, { replace: true })
		}
	}, [phase, payment, paymentId, orderId, navigate])

	const showCelebration =
		!paymentId || (phase === 'ready' && payment?.status === 'paid')
	const showVerifyLoading = paymentId && phase === 'loading'
	const showVerifyError = paymentId && phase === 'error'
	const showPendingNote =
		paymentId && phase === 'ready' && isPendingStatus(payment?.status)
	const showRefundedNote =
		paymentId && phase === 'ready' && payment?.status === 'refunded'

	useEffect(() => {
		if (!showCelebration) return
		setStep(0)
		requestAnimationFrame(() => setShow(true))
		timerRef.current = setTimeout(() => setStep(1), 600)
		const t2 = setTimeout(() => setStep(2), 1200)
		const t3 = setTimeout(() => setStep(3), 1800)
		return () => {
			clearTimeout(timerRef.current)
			clearTimeout(t2)
			clearTimeout(t3)
		}
	}, [showCelebration])

	useEffect(() => {
		if (showCelebration) return
		requestAnimationFrame(() => setShow(true))
	}, [showCelebration])

	return (
		<div className={`${styles.page} ${show ? styles.pageVisible : ''}`}>
			<div className={styles.bg}>
				<div className={styles.runeCircle} />
				<div className={styles.runeCircle2} />
				<div className={styles.glow} />
				{showCelebration && PARTICLES.map(p => <Particle key={p.id} {...p} />)}
			</div>

			<div className={`container ${styles.center}`}>
				<GlassCard maxWidth={520}>
					{showVerifyLoading && (
						<>
							<h1 className={styles.title} style={{ marginTop: 0 }}>
								Проверяем оплату…
							</h1>
							<p className={styles.subtitle}>
								Сверяем статус с банком. Это займёт несколько секунд.
							</p>
						</>
					)}

					{showVerifyError && (
						<>
							<h1 className={styles.title} style={{ marginTop: 0 }}>
								Не удалось проверить оплату
							</h1>
							<p className={styles.subtitle}>
								Проверьте заказ в личном кабинете или обновите страницу.
							</p>
							<div className={styles.actions} style={{ marginTop: 24 }}>
								<Button
									type='button'
									variant='primary'
									size='lg'
									onClick={() => window.location.reload()}
								>
									Обновить страницу
								</Button>
								<Button
									as={Link}
									to='/profile/orders'
									variant='ghost'
									size='lg'
								>
									Мои заказы
								</Button>
							</div>
						</>
					)}

					{showRefundedNote && (
						<>
							<h1 className={styles.title} style={{ marginTop: 0 }}>
								Платёж возвращён
							</h1>
							<p className={styles.subtitle}>
								По этому платежу оформлен возврат. Если у вас остались вопросы —
								напишите в поддержку.
							</p>
							<div className={styles.actions} style={{ marginTop: 24 }}>
								<Button as={Link} to='/catalog' variant='primary' size='lg'>
									В каталог
								</Button>
								<Button
									as={Link}
									to='/profile/orders'
									variant='ghost'
									size='lg'
								>
									Мои заказы
								</Button>
							</div>
						</>
					)}

					{showPendingNote && (
						<>
							<h1 className={styles.title} style={{ marginTop: 0 }}>
								Оплата подтверждается
							</h1>
							<p className={styles.subtitle}>
								Банк ещё обрабатывает платёж. Статус заказа скоро обновится —
								загляните в раздел «Мои заказы» или сохраните номер заказа
								{orderId ? ` №${orderId}` : ''}.
							</p>
							<div className={styles.actions} style={{ marginTop: 24 }}>
								<Button
									as={Link}
									to='/profile/orders'
									variant='primary'
									size='lg'
								>
									Мои заказы
								</Button>
								<Button as={Link} to='/catalog' variant='ghost' size='lg'>
									В каталог
								</Button>
							</div>
						</>
					)}

					{showCelebration && (
						<>
							<div
								className={`${styles.iconWrap} ${step >= 0 ? styles.iconVisible : ''}`}
							>
								<svg
									className={styles.checkSvg}
									viewBox='0 0 80 80'
									fill='none'
								>
									<circle
										className={styles.checkCircle}
										cx='40'
										cy='40'
										r='36'
										stroke='var(--color-primary)'
										strokeWidth='3'
									/>
									<path
										className={styles.checkMark}
										d='M24 42l10 10 22-24'
										stroke='var(--color-primary)'
										strokeWidth='3.5'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
								<div className={styles.iconGlow} />
							</div>

							<div
								className={`${styles.textBlock} ${step >= 1 ? styles.textVisible : ''}`}
							>
								<h1 className={styles.title}>Магия свершилась!</h1>
								<p className={styles.subtitle}>
									Ваш заказ принят и уже начинает своё путешествие к вам. Мы
									бережно соберём каждый предмет и отправим его с особой
									заботой.
								</p>
							</div>

							<div
								className={`${styles.details} ${step >= 2 ? styles.detailsVisible : ''}`}
							>
								<div className={styles.detailItem}>
									<div className={styles.detailIcon}>
										<IconMail size={20} />
									</div>
									<div>
										<strong>Подтверждение на email</strong>
										<p>Мы отправим детали заказа на вашу почту</p>
									</div>
								</div>
								<div className={styles.detailItem}>
									<div className={styles.detailIcon}>
										<IconTruck size={20} />
									</div>
									<div>
										<strong>Скоро отправим</strong>
										<p>Бережно соберём заказ и передадим в доставку</p>
									</div>
								</div>
							</div>

							<div
								className={`${styles.actions} ${step >= 3 ? styles.actionsVisible : ''}`}
							>
								<Button as={Link} to='/catalog' variant='primary' size='lg'>
									Продолжить покупки <IconArrowRight size={16} />
								</Button>
								<Button as={Link} to='/' variant='ghost' size='lg'>
									На главную
								</Button>
							</div>
						</>
					)}
				</GlassCard>
			</div>
		</div>
	)
}
