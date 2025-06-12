import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  cart: [],
}

export const slice = createSlice({
  name: "global",

  initialState,

  reducers: {
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

const { addCartItem, removeCartItem, plusCartItem, minusCartItem } =
  slice.actions

export { addCartItem, removeCartItem, plusCartItem, minusCartItem }

export default slice.reducer
