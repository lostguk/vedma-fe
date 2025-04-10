import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategories } from "src/store/slices/categories/slice"

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
      <div></div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
