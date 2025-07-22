import { Global, css } from "@emotion/react"

export const GlobalStyles = () => (
  <Global
    styles={css`
      html {
        font-family: sans-serif;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
      }

      body {
        margin: 0;
        height: 100%;
        font-family: "Roboto", "HelveticaNeue", "Helvetica Neue", sans-serif;
        color: white;
      }

      a {
        text-decoration: none;
      }

      #root {
        height: 100%;
      }

      .react-dadata__container {
        width: 100%;
      }

      /* Кастомизация всех скроллов */

      ::-webkit-scrollbar {
        width: 8px; /* Ширина скроллбара */
      }

      ::-webkit-scrollbar-track {
        background: #f1f1f1; /* Цвет фона трека */
        border-radius: 10px; /* Закругление углов трека */
      }

      ::-webkit-scrollbar-thumb {
        background: #888; /* Цвет ползунка */
        border-radius: 10px; /* Закругление углов ползунка */
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #555; /* Цвет ползунка при наведении */
      }

      *,
      *::before,
      *::after {
        box-sizing: inherit;
      }

      /* Конец кастомизации */

      .react-dadata__input {
        font-size: 14px;
      }
      .react-dadata__input::placeholder {
        font-size: 14px;
      }
    `}
  />
)

export default GlobalStyles
