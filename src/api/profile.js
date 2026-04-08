import apiClient from './client'

export function getProfile() {
  return apiClient.get('/profile')
}

export function updateProfile(data) {
  return apiClient.patch('/profile', {
    first_name: data.firstName,
    last_name: data.lastName,
    middle_name: data.middleName || '',
    email: data.email,
    phone: data.phone || '',
    address: data.address || '',
  })
}
