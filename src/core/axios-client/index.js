import axios from "axios"
import { LocalStorage } from "../helpers"
import { TOKEN_KEY } from "../constants"

let instance

export const setToken = (token) => {
  LocalStorage.set(TOKEN_KEY, token)
}

export const getToken = () => {
  return LocalStorage.get(TOKEN_KEY)
}

export const removeToken = () => {
  LocalStorage.remove(TOKEN_KEY)
}

export const initClient = () => {
  instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })

  instance.interceptors.request.use((config) => {
    if (getToken()) {
      config.headers.Authorization = `Bearer ${getToken()}`
    }

    return config
  })

  return instance
}

export default (() => {
  if (typeof instance === "undefined") {
    return initClient()
  }

  return instance
})()
