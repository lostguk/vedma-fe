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
        font-family: "Gilroy", sans-serif;
        color: white;
      }

      a {
        text-decoration: none;
        color: inherit;
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

      .slick-track {
        display: flex;
      }

      .slick-track .slick-slide {
        display: flex;
        height: auto;
      }







      
       /* Анимация для mask - точно по примеру */
      .mask-motion-enter,
      .mask-motion-appear,
      .mask-motion-leave {
        &-active {
          transition: all 0.3s;
        }
      }

      .mask-motion-enter,
      .mask-motion-appear {
        opacity: 0;

        &-active {
          opacity: 1;
        }
      }

      .mask-motion-leave {
        opacity: 1;

        &-active {
          opacity: 0;
        }
      }

      /* Анимация для panel справа - точно по примеру */
      .panel-motion-right-enter,
      .panel-motion-right-appear,
      .panel-motion-right-leave {
        &-start {
          transition: none !important;
        }

        &-active {
          transition: all 0.3s;
        }
      }

      .panel-motion-right-enter,
      .panel-motion-right-appear {
        transform: translateX(100%);

        &-active {
          transform: translateX(0);
        }
      }

      .panel-motion-right-leave {
        transform: translateX(0);

        &-active {
          transform: translateX(100%) !important;
        }
      }
    `}
  />
)

export default GlobalStyles
