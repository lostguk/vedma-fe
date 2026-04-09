import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { IconMail, IconPhone } from '../../components/Icons'
import { Button, GlassCard } from '../../components/ui'
import {
	isPendingStatus,
	usePaymentReturnVerification,
} from '../../hooks/usePaymentReturnVerification'
import styles from './OrderErrorPage.module.css'

export default function OrderErrorPage() {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const paymentId = searchParams.get('payment')
	const orderId = searchParams.get('order_id')

	const { phase, payment } = usePaymentReturnVerification(paymentId)
	const [show, setShow] = useState(false)

	useEffect(() => {
		if (phase !== 'ready' || !paymentId || !payment) return
		if (payment.status === 'paid') {
			const p = new URLSearchParams()
			p.set('payment', paymentId)
			if (orderId) p.set('order_id', orderId)
			navigate(`/payment-success?${p.toString()}`, { replace: true })
		}
	}, [phase, payment, paymentId, orderId, navigate])

	useEffect(() => {
		requestAnimationFrame(() => setShow(true))
	}, [])

	const showLoading = paymentId && phase === 'loading'
	const showPending =
		paymentId && phase === 'ready' && isPendingStatus(payment?.status)
	const showNetworkError = paymentId && phase === 'error'
	const showFailureCard =
		!paymentId || (phase === 'ready' && payment?.status === 'failed')

	return (
		<div className={`${styles.page} ${show ? styles.pageVisible : ''}`}>
			<div className={styles.bg}>
				<div className={styles.circle} />
			</div>

			<div className={`container ${styles.center}`}>
				<GlassCard
					maxWidth={500}
					tint={showFailureCard || showNetworkError ? 'error' : undefined}
				>
					{showLoading && (
						<>
							<h1 className={styles.title}>Проверяем статус оплаты…</h1>
							<p className={styles.subtitle}>
								Уточняем результат в платёжной системе.
							</p>
						</>
					)}

					{showNetworkError && (
						<>
							<h1 className={styles.title}>Не удалось проверить оплату</h1>
							<p className={styles.subtitle}>
								Обновите страницу или посмотрите заказ в личном кабинете.
							</p>
							<div className={styles.actions}>
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

					{showPending && (
						<>
							<h1 className={styles.title}>Статус уточняется</h1>
							<p className={styles.subtitle}>
								Платёж ещё обрабатывается. Если средства списались, заказ скоро
								отобразится как оплаченный в разделе «Мои заказы». При сомнениях
								напишите нам.
							</p>
							<div className={styles.help}>
								<div className={styles.helpItem}>
									<IconMail size={18} />
									<span>
										Напишите: <strong>help@vedmino-zelie.ru</strong>
									</span>
								</div>
							</div>
							<div className={styles.actions}>
								<Button
									as={Link}
									to='/profile/orders'
									variant='primary'
									size='lg'
								>
									Мои заказы
								</Button>
								<Button as={Link} to='/checkout' variant='ghost' size='lg'>
									К оформлению
								</Button>
							</div>
						</>
					)}

					{showFailureCard && (
						<>
							<div className={styles.iconWrap}>
								<svg
									className={styles.errorSvg}
									viewBox='0 0 80 80'
									fill='none'
								>
									<circle
										className={styles.errorCircle}
										cx='40'
										cy='40'
										r='36'
										stroke='var(--color-accent, #c94a4a)'
										strokeWidth='3'
									/>
									<path
										className={styles.errorX1}
										d='M28 28l24 24'
										stroke='var(--color-accent, #c94a4a)'
										strokeWidth='3.5'
										strokeLinecap='round'
									/>
									<path
										className={styles.errorX2}
										d='M52 28L28 52'
										stroke='var(--color-accent, #c94a4a)'
										strokeWidth='3.5'
										strokeLinecap='round'
									/>
								</svg>
							</div>

							<h1 className={styles.title}>Что-то пошло не так</h1>
							<p className={styles.subtitle}>
								К сожалению, оплата не прошла или была отклонена. Обычно деньги
								при этом не списываются — если списание всё же произошло, мы
								сверим статус по заказу
								{orderId ? ` №${orderId}` : ''} и поможем.
							</p>

							<div className={styles.help}>
								<div className={styles.helpItem}>
									<IconPhone size={18} />
									<span>
										Позвоните нам: <strong>+7 (800) 123-45-67</strong>
									</span>
								</div>
								<div className={styles.helpItem}>
									<IconMail size={18} />
									<span>
										Напишите: <strong>help@vedmino-zelie.ru</strong>
									</span>
								</div>
							</div>

							<div className={styles.actions}>
								<Button as={Link} to='/checkout' variant='primary' size='lg'>
									Попробовать снова
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
