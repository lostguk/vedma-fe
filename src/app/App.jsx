import React from "react"
import { RouterProvider } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import GlobalStyles from "./globalStyles"
import { router } from "./router"
import "react-responsive-modal/styles.css"
import "react-phone-number-input/style.css"

function App() {
  return (
    <>
      <GlobalStyles />
      <ToastContainer />
      <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
    </>
  )
}

export default App
