import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  cart: [],
}

export const slice = createSlice({
  name: "global",

  initialState,

  reducers: {
    setCart(state, { payload }) {
      state.cart = payload
    },
  },
})

const { setCart } = slice.actions

export { setCart }

export default slice.reducer
