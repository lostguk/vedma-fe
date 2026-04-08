import apiClient from './client'

export function calculateShipping(products, address) {
  return apiClient.post('/shipping/calculate', { products, address })
}
