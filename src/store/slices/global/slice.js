import { createSlice } from "@reduxjs/toolkit"
import { getCart } from "src/core/helpers"

const initialState = {
  cart: getCart() || [],
  user: null,
  isLoginLoading: false,
}

export const slice = createSlice({
  name: "global",

  initialState,

  reducers: {
    setUser(state, { payload }) {
      state.user = payload
    },
    addCartItem(state, { payload }) {
      state.cart = [...state.cart, { ...payload, count: 1 }]
    },
    removeCartItem(state, { payload }) {
      state.cart = state.cart.filter(({ id }) => id !== payload)
    },
    plusCartItem(state, { payload }) {
      const proxy = [...state.cart]

      proxy.find(({ id }) => id === payload).count += 1

      state.cart = proxy
    },
    minusCartItem(state, { payload }) {
      const proxy = [...state.cart]

      const currentProduct = proxy.find(({ id }) => id === payload)

      if (currentProduct.count > 1) {
        currentProduct.count -= 1

        state.cart = proxy
      } else {
        state.cart = state.cart.filter(({ id }) => id !== payload)
      }
    },
  },
})

const { addCartItem, removeCartItem, plusCartItem, minusCartItem, setUser } =
  slice.actions

export { addCartItem, removeCartItem, plusCartItem, minusCartItem, setUser }

export default slice.reducer
