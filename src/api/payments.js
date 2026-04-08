import apiClient from './client'

export function createPayment(data) {
  return apiClient.post('/payments', {
    order_id: data.orderId,
    success_url: data.successUrl || null,
    fail_url: data.failUrl || null,
  })
}

export function getPaymentStatus(publicId) {
  return apiClient.get(`/payments/${publicId}/status`)
}

export function refundPayment(publicId, amount = null) {
  return apiClient.post(`/payments/${publicId}/refund`, { amount })
}
