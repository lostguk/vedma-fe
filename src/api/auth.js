import apiClient from './client'

export function login(email, password) {
  return apiClient.post('/login', { email, password })
}

export function register(data) {
  return apiClient.post('/register', {
    first_name: data.firstName,
    last_name: data.lastName,
    middle_name: data.middleName || '',
    email: data.email,
    password: data.password,
    password_confirmation: data.passwordConfirmation,
    phone: data.phone || '',
    address: data.address || '',
  })
}

export function logout() {
  return apiClient.post('/logout')
}

export function forgotPassword(email) {
  return apiClient.post('/forgot-password', { email })
}

export function resetPassword(data) {
  return apiClient.post('/reset-password', {
    email: data.email,
    token: data.token,
    password: data.password,
    password_confirmation: data.passwordConfirmation,
  })
}

export function changePassword(data) {
  return apiClient.post('/change-password', {
    current_password: data.currentPassword,
    new_password: data.newPassword,
    new_password_confirmation: data.newPasswordConfirmation,
  })
}

export function verifyRegistration(userId, hash, params) {
  return apiClient.get(`/verify-registration/${userId}/${hash}`, { params })
}

export function resendVerification(email) {
  return apiClient.post('/verify-registration/resend', { email })
}
