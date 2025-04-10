import { configureStore } from "@reduxjs/toolkit"

import * as slices from "./slices"

export const store = configureStore({
  reducer: {
    global: slices.global,
    categories: slices.categories,
  },
})
