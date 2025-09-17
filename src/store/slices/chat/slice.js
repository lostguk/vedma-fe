import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosClient from "src/core/axios-client"

const fetchTopics = createAsyncThunk("fetchTopics", async () => {
  const response = await axiosClient.get("/topics")

  return response.data.data.data
})

const fetchTopic = createAsyncThunk("fetchTopic", async (id) => {
  const response = await axiosClient.get(`/topics/${id}`)

  return response.data.data
})

const initialState = {
  items: [],
  currentTopic: null,
}

export const slice = createSlice({
  name: "chat",

  initialState,

  reducers: {
    resetCurrentTopic(state) {
      state.currentTopic = null
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchTopics.fulfilled, (state, { payload }) => {
      state.items = payload
    })
    builder.addCase(fetchTopic.fulfilled, (state, { payload }) => {
      state.currentTopic = payload
    })
  },
})
const { resetCurrentTopic } = slice.actions

export { fetchTopics, fetchTopic, resetCurrentTopic }

export default slice.reducer
