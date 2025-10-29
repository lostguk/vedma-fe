import { createSlice } from "@reduxjs/toolkit"
import { MODAL_NAMES } from "src/core/constants"

const initialState = {
  [MODAL_NAMES.authModal]: {
    isOpen: false,
  },
}

export const slice = createSlice({
  name: "modals",

  initialState,

  reducers: {
    toggleModal(state, { payload: { name, isOpen } }) {
      state[name].isOpen = isOpen
    },
  },
})

const { toggleModal } = slice.actions

export { toggleModal }

export default slice.reducer
