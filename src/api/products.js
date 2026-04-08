import apiClient from './client'

export function getProducts(params = {}) {
  return apiClient.get('/products', { params })
}

export function getProduct(slug) {
  return apiClient.get(`/products/${slug}`)
}
