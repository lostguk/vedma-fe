import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosClient from "src/core/axios-client"

const fetchCategories = createAsyncThunk("fetchCategories", async () => {
  const response = await axiosClient.get("/categories")
  return response.data.data
})

const initialState = {
  items: [],
}

export const slice = createSlice({
  name: "categories",

  initialState,

  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, { payload }) => {
      state.items = payload
    })
  },
})

export { fetchCategories }

export default slice.reducer
