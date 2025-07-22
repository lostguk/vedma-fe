import { createBrowserRouter } from "react-router-dom"
import { PAGES } from "src/core/constants"
import DefaultLayout from "src/app/lauout"

import Main from "src/pages/main"
import CatalogPage from "src/pages/catalog"
import OrderPage from "src/pages/order"
import UserPage from "src/pages/user"
import DeliveryPage from "src/pages/delivery"
import ContactsPage from "src/pages/contacts"
import ReturnPage from "src/pages/return"

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
      {
        path: PAGES.user,
        element: <UserPage />,
      },
      {
        path: PAGES.delivery,
        element: <DeliveryPage />,
      },
      {
        path: PAGES.contacts,
        element: <ContactsPage />,
      },
      {
        path: PAGES.exchange,
        element: <ReturnPage />,
      },
    ],
  },
])
