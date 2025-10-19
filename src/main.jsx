import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./store"

import "react-dadata/dist/react-dadata.css"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import App from "src/app/App"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
