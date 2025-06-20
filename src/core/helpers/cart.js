import { LocalStorage } from "../helpers"
import { CART_KEY } from "../constants"

export const setCart = (cart) => {
  LocalStorage.set(CART_KEY, JSON.stringify(cart))
}

export const getCart = () => {
  return JSON.parse(LocalStorage.get(CART_KEY))
}

export const removeCart = () => {
  LocalStorage.remove(CART_KEY)
}
