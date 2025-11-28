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

const fetchMainPage= createAsyncThunk("fetchMainPage", async () => {
  const response = await axiosClient.get("/home")
  return response.data.data
})

const initialState = {
  candels: {
    isLoading: false,
    items: [],
  },
  mainData: {
    isLoading: false,
    data: {}
  }
}

export const slice = createSlice({
  name: "mainPage",

  initialState,

  extraReducers: (builder) => {
    builder.addCase(fetchCandels.pending, (state) => {
      state.candels.isLoading = true
    })

    
    builder.addCase(fetchMainPage.pending, (state) => {
      state.candels.isLoading = true
    })

    builder.addCase(fetchCandels.fulfilled, (state, { payload }) => {
      state.candels.items = payload
      state.candels.isLoading = false
    })
    
    builder.addCase(fetchMainPage.fulfilled, (state, { payload }) => {
      state.mainData.data = payload
      state.mainData.isLoading = false
    })
  },
})

export { fetchCandels, fetchMainPage }

export default slice.reducer
