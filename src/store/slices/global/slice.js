import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  test: null
}

export const slice = createSlice({
  name: 'global',

  initialState,

  reducers: {
    setTest(state, { payload }) {
      state.test = payload
    },
  },
})

const {
  setTest,
} = slice.actions

export {
  setTest
}

export default slice.reducer
