import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosClient from "src/core/axios-client"

const fetchOrderHistory = createAsyncThunk("fetchOrderHistory", async () => {
  const response = await axiosClient.get("/orders")

  return response.data.data.data
})

const initialState = {
  items: [],
}

export const slice = createSlice({
  name: "orderHistory",

  initialState,

  extraReducers: (builder) => {
    builder.addCase(fetchOrderHistory.fulfilled, (state, { payload }) => {
      state.items = payload
    })
  },
})

export { fetchOrderHistory }

export default slice.reducer
