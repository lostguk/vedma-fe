import apiClient from './client'

export function getCategories() {
  return apiClient.get('/categories')
}

export function getCategory(slug) {
  return apiClient.get(`/categories/${slug}`)
}
