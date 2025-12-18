import { createBrowserRouter } from "react-router-dom"
import { PAGES } from "src/core/constants"
import DefaultLayout from "src/app/layout"

import {
  Main,
  CatalogPage,
  OrderPage,
  UserPage,
  DeliveryPage,
  ContactsPage,
  ReturnPage,
  VerifyEmailPage,
  Product,
  CategoryPage,
  PoliticsPage,
  OfertaPage
} from "src/pages"

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
        path: PAGES.category,
        element: <CategoryPage />,
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
      {
        path: PAGES.verify,
        element: <VerifyEmailPage />,
      },
      {
        path: PAGES.product,
        element: <Product />,
      },
      {
        path: PAGES.oferta,
        element: <OfertaPage />,
      },
      {
        path: PAGES.politics,
        element: <PoliticsPage />,
      },
    ],
  },
])
