import { createBrowserRouter } from "react-router-dom"
import { PAGES } from "src/core/constants"
import Main from "src/pages/main"
import DefaultLayout from "src/app/lauout"

export const router = createBrowserRouter([
  {
    path: "*",
    element: <div>dich</div>,
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
])
