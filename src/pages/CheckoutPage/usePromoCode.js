import { useState, useCallback, useEffect } from 'react'
import { calculateOrder } from '../../api/orders'

const PROMO_STATUS_MESSAGES = {
  not_exists: 'Промокод не найден или срок его действия истёк',
  not_applied: 'Промокод не применим к товарам в корзине',
}

function promoFailureMessage(data) {
  const items = Array.isArray(data?.items) ? data.items : []
  if (
    data?.promo_code_status === 'not_applied' &&
    items.length > 0 &&
    items.every((item) => item.wholesale)
  ) {
    return 'Промокод не действует на товары по оптовой цене'
  }
  return PROMO_STATUS_MESSAGES[data?.promo_code_status] || 'Промокод недействителен'
}

function promoDescription(data, code) {
  const discount = (data.total_without_discount || 0) - (data.total_with_discount || 0)
  return discount > 0
    ? `Скидка ${discount.toLocaleString('ru-RU')} ₽`
    : `Промокод ${code} применён`
}

export default function usePromoCode(cartItems) {
  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState(null)
  const [promoApplying, setPromoApplying] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [calcResult, setCalcResult] = useState(null)

  useEffect(() => {
    if (!cartItems.length) {
      setCalcResult(null)
      return undefined
    }

    let cancelled = false
    const timer = setTimeout(() => {
      const code = promoApplied?.code || null
      const mapped = cartItems.map((i) => ({ id: Number(i.id), count: i.qty }))
      calculateOrder(mapped, code)
        .then((res) => {
          if (cancelled) return
          const data = res.data?.data ?? res.data
          setCalcResult(data)
          if (!code) return
          if (data.promo_code_status === 'applied') {
            setPromoApplied((prev) =>
              prev ? { ...prev, description: promoDescription(data, code) } : prev,
            )
            return
          }
          setPromoApplied(null)
          setPromoError(promoFailureMessage(data))
        })
        .catch(() => {
          if (!cancelled) setCalcResult(null)
        })
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [cartItems, promoApplied?.code])

  const removePromo = useCallback(() => {
    setPromoApplied(null)
    setPromoInput('')
    setPromoError('')
  }, [])

  const applyPromo = useCallback(async () => {
    if (promoApplying) return
    if (promoApplied) {
      setPromoError('Уже действует промокод. Сначала нажмите «Убрать».')
      return
    }
    const code = promoInput.trim().toUpperCase()
    if (!code) {
      setPromoError('Введите промокод')
      return
    }
    setPromoError('')
    setPromoApplying(true)
    try {
      const items = cartItems.map((i) => ({ id: Number(i.id), count: i.qty }))
      const res = await calculateOrder(items, code)
      const data = res.data?.data ?? res.data
      setCalcResult(data)
      if (data.promo_code_status === 'applied') {
        setPromoApplied({
          code,
          description: promoDescription(data, code),
        })
        setPromoInput('')
      } else {
        setPromoError(promoFailureMessage(data))
      }
    } catch {
      setPromoError('Не удалось проверить промокод')
    } finally {
      setPromoApplying(false)
    }
  }, [promoApplying, promoApplied, promoInput, cartItems])

  return {
    promoInput,
    setPromoInput,
    promoApplied,
    promoApplying,
    promoError,
    setPromoError,
    applyPromo,
    removePromo,
    calcResult,
  }
}
