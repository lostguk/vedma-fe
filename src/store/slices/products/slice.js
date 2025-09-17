import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosClient from "src/core/axios-client"

const fetchProducts = createAsyncThunk(
  "fetchProducts",
  async ({ page, per_page, category }) => {
    const params = {
      per_page,
      page,
    }

    if (category) {
      params.category = category
    }

    const response = await axiosClient.get("/products", { params })

    return response.data
  },
)

const initialState = {
  items: [],
  page: 1,
  per_page: 9,
  total: 0,
  filter: {
    search: "",
    category: null,
  },
  isLoading: false,
}

export const slice = createSlice({
  name: "products",

  initialState,

  reducers: {
    setFilter(state, { payload: { filter, value } }) {
      state.filter[filter] = value
    },
    setPage(state, { payload }) {
      state.page = payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchProducts.fulfilled, (state, { payload }) => {
      state.items = payload.data
      state.total = payload.meta.total
      state.isLoading = false
    })
  },
})

const { setPage, setFilter } = slice.actions

export { fetchProducts, setPage, setFilter }

export default slice.reducer
