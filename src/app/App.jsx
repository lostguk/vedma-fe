import React from "react"
import { RouterProvider } from "react-router-dom"
import GlobalStyles from "./globalStyles"
import { router } from "./router"

function App() {
  return (
    <>
      <GlobalStyles />
      <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
    </>
  )
}

export default App
