import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { suggestAddress } from '../../api/dadata'
import { createOrder } from '../../api/orders'
import { createPayment } from '../../api/payments'
import { calculateShipping } from '../../api/shipping'
import LoginModal from '../../components/LoginModal/LoginModal'
import { Breadcrumbs, PageShell } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import {
	ADDRESS_INCOMPLETE_MESSAGE,
	getAddressValidationError,
	isDeliverableAddress,
} from '../../utils/address'
import CheckoutContactSection from './CheckoutContactSection'
import CheckoutDeliverySection from './CheckoutDeliverySection'
import styles from './CheckoutPage.module.css'
import CheckoutSummary from './CheckoutSummary'
import usePromoCode from './usePromoCode'

function getApiErrors(error) {
	if (error.response?.data?.errors) {
		return Object.values(error.response.data.errors).flat().join('. ')
	}
	return error.response?.data?.message || 'Произошла ошибка. Попробуйте позже.'
}

const initialForm = {
	lastName: '',
	firstName: '',
	middleName: '',
	phone: '',
	email: '',
	password: '',
	passwordConfirm: '',
	address: '',
}

const FIELD_FOCUS_IDS = [
	['lastName', 'co-lastname'],
	['firstName', 'co-firstname'],
	['phone', 'co-phone'],
	['email', 'co-email'],
	['password', 'co-pass'],
	['passwordConfirm', 'co-pass2'],
]

function checkoutToastMessage(fieldErrors, addressMessage) {
	const parts = [
		fieldErrors.lastName,
		fieldErrors.firstName,
		fieldErrors.phone,
		fieldErrors.email,
		fieldErrors.password,
		fieldErrors.passwordConfirm,
		addressMessage,
		fieldErrors.consent,
	].filter(Boolean)
	if (parts.length === 1) return parts[0]
	return 'Заполните обязательные поля'
}

function scrollToCheckoutError(fieldErrors, addressMessage) {
	let id = null
	for (const [key, elId] of FIELD_FOCUS_IDS) {
		if (fieldErrors[key]) {
			id = elId
			break
		}
	}
	if (!id && addressMessage) id = 'co-address'
	if (!id && fieldErrors.consent) id = 'co-consent'
	const el = id ? document.getElementById(id) : null
	if (!el) return
	el.scrollIntoView({ behavior: 'smooth', block: 'center' })
	if (typeof el.focus === 'function') {
		try {
			el.focus({ preventScroll: true })
		} catch {
			el.focus()
		}
	}
}

export default function CheckoutPage() {
	const navigate = useNavigate()
	const { items, updateQty, removeFromCart, clearCart, totalPrice } = useCart()
	const { user, isAuthenticated, signOut } = useAuth()
	const [loginOpen, setLoginOpen] = useState(false)
	const [form, setForm] = useState(initialForm)
	const [errors, setErrors] = useState({})
	const [addressError, setAddressError] = useState('')
	const [addressData, setAddressData] = useState(null)
	const [addressConfirmed, setAddressConfirmed] = useState(false)
	const [consent, setConsent] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const [createdOrderId, setCreatedOrderId] = useState(null)
	const [paymentError, setPaymentError] = useState('')
	const [deliveryPrice, setDeliveryPrice] = useState(null)
	const [deliveryLoading, setDeliveryLoading] = useState(false)
	const [submitAttempted, setSubmitAttempted] = useState(false)
	const shippingTimerRef = useRef(null)

	const promo = usePromoCode(items)

	const recalcShipping = useCallback((address, cartItems) => {
		clearTimeout(shippingTimerRef.current)
		if (!address || address.length < 5 || !cartItems.length) {
			setDeliveryPrice(null)
			return
		}
		setDeliveryLoading(true)
		shippingTimerRef.current = setTimeout(() => {
			const products = cartItems.map(i => ({
				id: Number(i.id),
				quantity: i.qty,
			}))
			calculateShipping(products, address)
				.then(res => {
					const data = res.data?.data ?? res.data
					if (data?.error) {
						setDeliveryPrice(null)
						return
					}
					const postOffice = data?.PostOffice?.[0]
					const totalStr = postOffice?.service?.total
					if (totalStr) {
						setDeliveryPrice(Math.round(parseFloat(totalStr)))
						return
					}
					const hasOffers = ['PostOffice', 'DeliveryPoint', 'Courier'].some(
						key => Array.isArray(data?.[key]) && data[key].length > 0,
					)
					setDeliveryPrice(hasOffers ? null : 0)
				})
				.catch(() => setDeliveryPrice(null))
				.finally(() => setDeliveryLoading(false))
		}, 500)
	}, [])

	useEffect(() => {
		if (items.length === 0 && !submitting)
			navigate('/catalog', { replace: true })
	}, [items.length, submitting, navigate])

	useEffect(() => {
		if (
			form.address &&
			addressConfirmed &&
			isDeliverableAddress(addressData) &&
			items.length
		) {
			recalcShipping(form.address, items)
			return
		}
		setDeliveryPrice(null)
	}, [form.address, addressConfirmed, addressData, items, recalcShipping])

	useEffect(() => {
		if (!user) return
		setForm(prev => ({
			...prev,
			email: user.email || '',
			firstName: user.first_name || prev.firstName,
			lastName: user.last_name || prev.lastName,
			middleName: user.middle_name || prev.middleName,
			phone: user.phone || prev.phone,
			address: user.address || prev.address,
		}))
		if (user.address) {
			suggestAddress(user.address, 1)
				.then(res => {
					const suggestions = res.data?.data?.suggestions || []
					const match = Array.isArray(suggestions)
						? suggestions.find(item => {
								const text = item.value || item.unrestricted_value || ''
								return text === user.address && isDeliverableAddress(item)
							})
						: null
					if (match) {
						setAddressData(match)
						setAddressConfirmed(true)
					} else {
						setAddressConfirmed(false)
						setAddressData(null)
					}
				})
				.catch(() => {
					setAddressConfirmed(false)
					setAddressData(null)
				})
		} else {
			setAddressConfirmed(false)
			setAddressData(null)
		}
	}, [user])

	const calcResult = promo.calcResult
	const subtotal = calcResult?.total_without_discount ?? totalPrice
	const discountAmount = calcResult
		? calcResult.total_without_discount - calcResult.total_with_discount
		: 0
	const total = Math.max(
		0,
		(calcResult?.total_with_discount ?? subtotal) + (deliveryPrice || 0),
	)

	const addressErrorText = getAddressValidationError({
		address: form.address,
		addressConfirmed,
		addressData,
	})
	const visibleAddressError =
		addressError || (submitAttempted ? addressErrorText : '')

	const setField = (key, value) => {
		setForm(prev => ({ ...prev, [key]: value }))
		if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
	}

	const handleAddressChange = (text, dadataItem) => {
		setForm(p => ({ ...p, address: text }))
		setAddressError('')
		if (errors.address) setErrors(p => ({ ...p, address: '' }))
		if (dadataItem) {
			setAddressData(dadataItem)
			setAddressConfirmed(isDeliverableAddress(dadataItem))
			if (!isDeliverableAddress(dadataItem)) {
				setAddressError(ADDRESS_INCOMPLETE_MESSAGE)
			}
		} else {
			setAddressConfirmed(false)
			setAddressData(null)
		}
	}

	const handleAddressSelect = dadataItem => {
		setAddressData(dadataItem)
		if (isDeliverableAddress(dadataItem)) {
			setAddressConfirmed(true)
			setAddressError('')
		} else {
			setAddressConfirmed(false)
			setAddressError(ADDRESS_INCOMPLETE_MESSAGE)
		}
	}

	const validate = () => {
		const e = {}
		const phoneDigits = form.phone.replace(/\D/g, '')
		if (phoneDigits.length !== 11) e.phone = 'Введите полный номер телефона'

		let addressErr = getAddressValidationError({
			address: form.address,
			addressConfirmed,
			addressData,
		})
		if (!addressErr && deliveryLoading) {
			addressErr = 'Считаем стоимость доставки...'
		} else if (!addressErr && deliveryPrice == null) {
			addressErr = 'Не удалось рассчитать стоимость доставки. Проверьте адрес.'
		}
		setAddressError(addressErr)

		if (!isAuthenticated) {
			if (!form.lastName.trim()) e.lastName = 'Обязательное поле'
			if (!form.firstName.trim()) e.firstName = 'Обязательное поле'
			const em = form.email.trim().toLowerCase()
			if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))
				e.email = 'Введите корректный email'
			if (form.password.length < 8) e.password = 'Не менее 8 символов'
			if (form.password !== form.passwordConfirm)
				e.passwordConfirm = 'Пароли не совпадают'
		}

		if (!consent)
			e.consent = 'Необходимо согласие на обработку персональных данных'

		setErrors(e)
		const ok = Object.keys(e).length === 0 && !addressErr
		return { ok, fieldErrors: e, addressErr }
	}

	const handleSubmit = async ev => {
		ev.preventDefault()
		setSubmitAttempted(true)
		const result = validate()
		if (!result.ok) {
			toast.error(checkoutToastMessage(result.fieldErrors, result.addressErr))
			requestAnimationFrame(() => {
				scrollToCheckoutError(result.fieldErrors, result.addressErr)
			})
			return
		}

		setSubmitting(true)
		setPaymentError('')
		try {
			const orderData = {
				items: items.map(i => ({ id: Number(i.id), count: i.qty })),
				promo_code: promo.promoApplied?.code || null,
				register: !isAuthenticated,
				delivery_type: 'PostOffice',
				first_name: isAuthenticated ? user.first_name : form.firstName.trim(),
				last_name: isAuthenticated ? user.last_name : form.lastName.trim(),
				middle_name: isAuthenticated
					? user.middle_name || ''
					: form.middleName.trim(),
				email: isAuthenticated ? user.email : form.email.trim().toLowerCase(),
				phone: isAuthenticated && user.phone ? user.phone : form.phone.trim(),
				address: form.address.trim(),
			}
			if (!isAuthenticated) {
				orderData.password = form.password
			}

			const orderRes = await createOrder(orderData)
			const order = orderRes.data?.data ?? orderRes.data
			setCreatedOrderId(order.id)

			await attemptPayment(order.id)
		} catch (err) {
			toast.error(getApiErrors(err))
		} finally {
			setSubmitting(false)
		}
	}

	const attemptPayment = async orderId => {
		setSubmitting(true)
		setPaymentError('')
		try {
			const payRes = await createPayment({
				orderId,
				successUrl: `${window.location.origin}/payment-success?order_id=${orderId}`,
				failUrl: `${window.location.origin}/payment-error?order_id=${orderId}`,
			})
			const payment = payRes.data?.data ?? payRes.data
			if (payment.payment_url) {
				window.location.href = payment.payment_url
				return
			}
			setPaymentError(
				'Не удалось получить ссылку на оплату. Попробуйте ещё раз.',
			)
		} catch (err) {
			const msg = err.response?.data?.message || 'Не удалось создать платёж'
			setPaymentError(msg)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<PageShell className={styles.shell}>
			<div className={styles.layout}>
				<div className={styles.main}>
					<Breadcrumbs
						items={[
							{ label: 'Главная', to: '/' },
							{ label: 'Каталог', to: '/catalog' },
							{ label: 'Оформление' },
						]}
					/>

					<h1 className={styles.title}>Оформить заказ</h1>

					{createdOrderId && paymentError && (
						<div className={styles.paymentErrorBanner}>
							<p className={styles.paymentErrorText}>{paymentError}</p>
							<p className={styles.paymentErrorHint}>
								Заказ #{createdOrderId} создан. Вы можете повторить оплату,
								оплатить позже в личном кабинете или{' '}
								<Link to='/profile/chat' className={styles.paymentErrorLink}>
									написать нам в чат поддержки
								</Link>{' '}
								— мы поможем решить проблему.
							</p>
							<div className={styles.paymentErrorActions}>
								<button
									type='button'
									className={styles.paymentRetryBtn}
									disabled={submitting}
									onClick={() => attemptPayment(createdOrderId)}
								>
									{submitting ? 'Перенаправляем...' : 'Повторить оплату'}
								</button>
								<button
									type='button'
									className={styles.paymentLaterBtn}
									onClick={() => {
										clearCart()
										navigate('/profile/orders')
									}}
								>
									Оплатить позже
								</button>
							</div>
						</div>
					)}

					<form
						id='checkout-order-form'
						className={styles.form}
						onSubmit={handleSubmit}
						noValidate
					>
						<CheckoutContactSection
							form={form}
							errors={errors}
							setField={setField}
							isAuthenticated={isAuthenticated}
							user={user}
							signOut={signOut}
							onLoginOpen={() => setLoginOpen(true)}
							consent={consent}
							onConsentChange={checked => {
								setConsent(checked)
								if (errors.consent)
									setErrors(prev => ({ ...prev, consent: '' }))
							}}
						/>

						<CheckoutDeliverySection
							form={form}
							errors={errors}
							addressError={visibleAddressError}
							onAddressChange={handleAddressChange}
							onAddressSelect={handleAddressSelect}
						/>

						<button
							type='submit'
							className={styles.submitMobile}
							disabled={submitting}
						>
							{submitting
								? 'Оформляем...'
								: `Оформить заказ — ${total.toLocaleString('ru-RU')} ₽`}
						</button>
					</form>
				</div>

				<CheckoutSummary
					items={items}
					subtotal={subtotal}
					discountAmount={Math.abs(discountAmount)}
					deliveryPrice={deliveryPrice}
					deliveryLoading={deliveryLoading}
					total={total}
					promoApplied={promo.promoApplied}
					promoInput={promo.promoInput}
					setPromoInput={promo.setPromoInput}
					promoApplying={promo.promoApplying}
					promoError={promo.promoError}
					setPromoError={promo.setPromoError}
					applyPromo={promo.applyPromo}
					removePromo={promo.removePromo}
					updateQty={updateQty}
					removeFromCart={removeFromCart}
					submitting={submitting}
				/>
			</div>

			<LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
		</PageShell>
	)
}
