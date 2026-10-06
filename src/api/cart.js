import apiClient from './client'

function toPayload(items) {
  return (items || [])
    .map((item) => ({
      id: Number(item.id),
      quantity: item.qty,
    }))
    .filter((item) => Number.isFinite(item.id) && item.id > 0 && item.quantity > 0)
}

export function getCart() {
  return apiClient.get('/cart')
}

export function replaceCart(items) {
  return apiClient.put('/cart', { items: toPayload(items) })
}

export function mergeCart(items) {
  return apiClient.post('/cart/merge', { items: toPayload(items) })
}

export function deleteCart() {
  return apiClient.delete('/cart')
}
