import apiClient from './client'

export function calculateOrder(items, promoCode = null) {
  return apiClient.post('/order/calculate', {
    items,
    promo_code: promoCode,
  })
}

export function createOrder(data) {
  return apiClient.post('/order', data)
}

export function getOrders(params = {}) {
  return apiClient.get('/orders', { params })
}
