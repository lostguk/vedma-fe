import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { createOrder } from '../../api/orders'
import { createPayment } from '../../api/payments'
import { calculateShipping } from '../../api/shipping'
import { Breadcrumbs, PageShell } from '../../components/ui'
import LoginModal from '../../components/LoginModal/LoginModal'
import usePromoCode from './usePromoCode'
import CheckoutContactSection from './CheckoutContactSection'
import CheckoutDeliverySection from './CheckoutDeliverySection'
import CheckoutSummary from './CheckoutSummary'
import styles from './CheckoutPage.module.css'

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
      const products = cartItems.map((i) => ({ id: Number(i.id), quantity: i.qty }))
      calculateShipping(products, address)
        .then((res) => {
          const data = res.data?.data ?? res.data
          const postOffice = data?.PostOffice?.[0]
          const totalStr = postOffice?.service?.total
          const price = totalStr ? Math.round(parseFloat(totalStr)) : null
          setDeliveryPrice(price)
        })
        .catch(() => setDeliveryPrice(null))
        .finally(() => setDeliveryLoading(false))
    }, 500)
  }, [])

  useEffect(() => {
    if (items.length === 0 && !submitting) navigate('/catalog', { replace: true })
  }, [items.length, submitting, navigate])

  useEffect(() => {
    if (form.address && addressConfirmed && items.length) {
      recalcShipping(form.address, items)
    }
  }, [form.address, addressConfirmed, items, recalcShipping])

  useEffect(() => {
    if (!user) return
    setForm((prev) => ({
      ...prev,
      email: user.email || '',
      firstName: user.first_name || prev.firstName,
      lastName: user.last_name || prev.lastName,
      middleName: user.middle_name || prev.middleName,
      phone: user.phone || prev.phone,
      address: user.address || prev.address,
    }))
    if (user.address) setAddressConfirmed(true)
  }, [user])

  const calcResult = promo.calcResult
  const subtotal = calcResult?.total_without_discount ?? totalPrice
  const discountAmount = calcResult ? (calcResult.total_without_discount - calcResult.total_with_discount) : 0
  const total = Math.max(0, (calcResult?.total_with_discount ?? subtotal) + (deliveryPrice || 0))

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const handleAddressChange = (text, dadataItem) => {
    setForm((p) => ({ ...p, address: text }))
    setAddressError('')
    if (errors.address) setErrors((p) => ({ ...p, address: '' }))
    if (dadataItem) {
      setAddressData(dadataItem)
      setAddressConfirmed(true)
    } else {
      setAddressConfirmed(false)
      setAddressData(null)
    }
  }

  const handleAddressSelect = (dadataItem) => {
    setAddressData(dadataItem)
    setAddressConfirmed(true)
    setAddressError('')
  }

  const validate = () => {
    const e = {}
    const phoneDigits = form.phone.replace(/\D/g, '')
    if (phoneDigits.length !== 11) e.phone = 'Введите полный номер телефона'

    if (!form.address.trim()) {
      setAddressError('Укажите адрес доставки')
    } else if (!addressConfirmed) {
      setAddressError('Выберите адрес из подсказок')
    }

    if (!isAuthenticated) {
      if (!form.lastName.trim()) e.lastName = 'Обязательное поле'
      if (!form.firstName.trim()) e.firstName = 'Обязательное поле'
      const em = form.email.trim().toLowerCase()
      if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) e.email = 'Введите корректный email'
      if (form.password.length < 8) e.password = 'Не менее 8 символов'
      if (form.password !== form.passwordConfirm) e.passwordConfirm = 'Пароли не совпадают'
    }

    if (!consent) e.consent = 'Необходимо согласие на обработку персональных данных'

    setErrors(e)
    const hasAddressError = !form.address.trim() || !addressConfirmed
    return Object.keys(e).length === 0 && !hasAddressError
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setPaymentError('')
    try {
      const orderData = {
        items: items.map((i) => ({ id: Number(i.id), count: i.qty })),
        promo_code: promo.promoApplied?.code || null,
        register: !isAuthenticated,
        delivery_type: 'PostOffice',
        first_name: isAuthenticated ? user.first_name : form.firstName.trim(),
        last_name: isAuthenticated ? user.last_name : form.lastName.trim(),
        middle_name: isAuthenticated ? (user.middle_name || '') : form.middleName.trim(),
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

  const attemptPayment = async (orderId) => {
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
      setPaymentError('Не удалось получить ссылку на оплату. Попробуйте ещё раз.')
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
          <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Каталог', to: '/catalog' }, { label: 'Оформление' }]} />

          <h1 className={styles.title}>Оформить заказ</h1>

          {createdOrderId && paymentError && (
            <div className={styles.paymentErrorBanner}>
              <p className={styles.paymentErrorText}>{paymentError}</p>
              <p className={styles.paymentErrorHint}>
                Заказ #{createdOrderId} создан. Вы можете повторить оплату, оплатить позже в личном кабинете
                или <Link to="/profile/chat" className={styles.paymentErrorLink}>написать нам в чат поддержки</Link> — мы поможем решить проблему.
              </p>
              <div className={styles.paymentErrorActions}>
                <button
                  type="button"
                  className={styles.paymentRetryBtn}
                  disabled={submitting}
                  onClick={() => attemptPayment(createdOrderId)}
                >
                  {submitting ? 'Перенаправляем...' : 'Повторить оплату'}
                </button>
                <button
                  type="button"
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

          <form id="checkout-order-form" className={styles.form} onSubmit={handleSubmit} noValidate>
            <CheckoutContactSection
              form={form}
              errors={errors}
              setField={setField}
              isAuthenticated={isAuthenticated}
              user={user}
              signOut={signOut}
              onLoginOpen={() => setLoginOpen(true)}
              consent={consent}
              onConsentChange={setConsent}
            />

            <CheckoutDeliverySection
              form={form}
              errors={errors}
              addressError={addressError}
              onAddressChange={handleAddressChange}
              onAddressSelect={handleAddressSelect}
            />

            <button type="submit" className={styles.submitMobile} disabled={submitting}>
              {submitting ? 'Оформляем...' : `Оформить заказ — ${total.toLocaleString('ru-RU')} ₽`}
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
