import { createBrowserRouter } from "react-router-dom"
import { PAGES } from "src/core/constants"
import DefaultLayout from "src/app/lauout"

import Main from "src/pages/main"
import CatalogPage from "src/pages/catalog"

export const router = createBrowserRouter([
  {
    path: "*",
    element: <div>Not found</div>,
  },
  {
    element: <DefaultLayout />,
    children: [
      {
        path: PAGES.main,
        element: <Main />,
      },
    ],
  },
  {
    element: <DefaultLayout />,
    children: [
      {
        path: PAGES.catalog,
        element: <CatalogPage />,
      },
    ],
  },
])
