import axios from 'axios'

const TOKEN_KEY = 'vedmino-token'

function getToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    if (!raw || raw === 'undefined') return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
}

function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
    }
    return Promise.reject(error)
  },
)

export { getToken, setToken, removeToken }
export default apiClient
