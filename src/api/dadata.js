import apiClient from './client'

export function suggestAddress(query, count = 5, language = 'ru') {
  return apiClient.post('/order/address/suggest', { query, count, language })
}
