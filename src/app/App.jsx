import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategories } from "src/store/slices/categories/slice"
import { RouterProvider } from "react-router-dom"
import GlobalStyles from "./globalStyles"
import { router } from "./router"

function App() {
  const dispatch = useDispatch()
  const [count, setCount] = useState(0)
  const f = () => {}

  useEffect(() => {
    dispatch(fetchCategories())
    console.log(import.meta.env)
  }, [])
  return (
    <>
      <GlobalStyles />
      <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
    </>
  )
}

export default App
