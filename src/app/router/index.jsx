import { createBrowserRouter } from "react-router-dom"
import { PAGES } from "src/core/constants"
import DefaultLayout from "src/app/lauout"

import Main from "src/pages/main"
import CatalogPage from "src/pages/catalog"
import OrderPage from "src/pages/order"

export const router = createBrowserRouter([
  {
    path: "*",
    element: <div style={{ color: "black" }}>Not found</div>,
  },
  {
    element: <DefaultLayout />,
    children: [
      {
        path: PAGES.main,
        element: <Main />,
      },
      {
        path: PAGES.catalog,
        element: <CatalogPage />,
      },
      {
        path: PAGES.order,
        element: <OrderPage />,
      },
    ],
  },
])
