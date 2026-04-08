import { useState, useCallback, useEffect, useRef } from 'react'
import { calculateOrder } from '../../api/orders'

const PROMO_STATUS_MESSAGES = {
  not_exists: 'Промокод не найден или срок его действия истёк',
  not_applied: 'Промокод не применим к товарам в корзине',
}

export default function usePromoCode(cartItems) {
  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState(null)
  const [promoApplying, setPromoApplying] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [calcResult, setCalcResult] = useState(null)
  const recalcTimer = useRef(null)

  const recalculate = useCallback(async (code, items) => {
    if (!code || !items.length) return
    try {
      const mapped = items.map((i) => ({ id: Number(i.id), count: i.qty }))
      const res = await calculateOrder(mapped, code)
      const data = res.data?.data ?? res.data
      if (data.promo_code_status === 'applied') {
        const totalWithout = data.total_without_discount || 0
        const totalWith = data.total_with_discount || 0
        const discount = totalWithout - totalWith
        setPromoApplied((prev) => prev ? {
          ...prev,
          description: discount > 0 ? `Скидка ${discount.toLocaleString('ru-RU')} ₽` : `Промокод ${code} применён`,
        } : prev)
        setCalcResult(data)
      }
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    if (!promoApplied?.code) return
    clearTimeout(recalcTimer.current)
    recalcTimer.current = setTimeout(() => {
      recalculate(promoApplied.code, cartItems)
    }, 300)
    return () => clearTimeout(recalcTimer.current)
  }, [cartItems, promoApplied?.code, recalculate])

  const removePromo = useCallback(() => {
    setPromoApplied(null)
    setPromoInput('')
    setPromoError('')
    setCalcResult(null)
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
      const status = data.promo_code_status

      if (status === 'applied') {
        const totalWithout = data.total_without_discount || 0
        const totalWith = data.total_with_discount || 0
        const discount = totalWithout - totalWith
        setPromoApplied({
          code,
          description: discount > 0 ? `Скидка ${discount.toLocaleString('ru-RU')} ₽` : `Промокод ${code} применён`,
        })
        setCalcResult(data)
        setPromoInput('')
      } else {
        setPromoError(PROMO_STATUS_MESSAGES[status] || 'Промокод недействителен')
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
