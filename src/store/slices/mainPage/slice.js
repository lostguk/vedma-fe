import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosClient from "src/core/axios-client"

const fetchCandels = createAsyncThunk("fetchCandels", async () => {
  const response = await axiosClient.get("/products", {
    params: {
      category: "vse-svechi",
      page: 1,
      per_page: 3,
    },
  })
  return response.data.data
})

const initialState = {
  candels: {
    isLoading: false,
    items: [],
  },
}

export const slice = createSlice({
  name: "mainPage",

  initialState,

  extraReducers: (builder) => {
    builder.addCase(fetchCandels.pending, (state) => {
      state.candels.isLoading = true
    })
    builder.addCase(fetchCandels.fulfilled, (state, { payload }) => {
      state.candels.items = payload
      state.candels.isLoading = false
    })
  },
})

export { fetchCandels }

export default slice.reducer
