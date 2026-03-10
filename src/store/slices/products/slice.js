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

const fetchProduct = createAsyncThunk("fetchProduct", async ({ slug }) => {
  const response = await axiosClient.get(`/products/${slug}`)

  return response.data
})

const initialState = {
  items: [],
  item: {},
  page: 1,
  per_page: 9,
  total: 0,
  totalPages: 0,
  filter: {
    search: "",
    slugs: [],
  },
  catalogMenuLevel: 0,
  catalogMenu: [],
  isLoading: false,
  isProductLoading: false,
}

export const slice = createSlice({
  name: "products",

  initialState,

  reducers: {
    setCatalogMenu(state, { payload }) {
      state.catalogMenu = payload
      state.page = initialState.page
    },

    setFilter(state, { payload }) {
      state.filter = { ...state.filter, ...payload }
      state.page = initialState.page
    },
    resetCatalog(state) {
      state.filter = initialState.filter
      state.catalogMenuLevel = initialState.catalogMenuLevel
      state.catalogMenu = initialState.catalogMenu
      state.page = initialState.page
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
      state.totalPages = payload.meta.last_page
      state.isLoading = false
    })

    builder.addCase(fetchProduct.pending, (state) => {
      state.isProductLoading = true
    })

    builder.addCase(fetchProduct.fulfilled, (state, { payload }) => {
      state.item = payload.data
      state.isProductLoading = false
    })
  },
})

const { setPage, setFilter, setCatalogMenu, resetCatalog } = slice.actions

export {
  fetchProducts,
  setPage,
  setFilter,
  fetchProduct,
  setCatalogMenu,
  resetCatalog,
}

export default slice.reducer
