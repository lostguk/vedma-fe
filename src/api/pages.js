import apiClient from './client'

export function getPages() {
  return apiClient.get('/pages')
}

export function getPage(id) {
  return apiClient.get(`/pages/${id}`)
}
