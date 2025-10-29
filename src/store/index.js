import { configureStore } from "@reduxjs/toolkit"

import * as slices from "./slices"

export const store = configureStore({
  reducer: {
    global: slices.global,
    categories: slices.categories,
    products: slices.products,
    mainPage: slices.mainPage,
    chat: slices.chat,
    orderHistory: slices.orderHistory,
    modals: slices.modals,
  },
})
