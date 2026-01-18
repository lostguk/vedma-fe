import { Global, css } from '@emotion/react'

export const SidePageGlobalStyles = () => (
  <Global
    styles={() => css`
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

      /* Анимация для panel слева - точно по примеру */
      .panel-motion-left-enter,
      .panel-motion-left-appear,
      .panel-motion-left-leave {
        &-start {
          transition: none !important;
        }

        &-active {
          transition: all 0.3s;
        }
      }

      .panel-motion-left-enter,
      .panel-motion-left-appear {
        transform: translateX(-100%);

        &-active {
          transform: translateX(0);
        }
      }

      .panel-motion-left-leave {
        transform: translateX(0);

        &-active {
          transform: translateX(-100%) !important;
        }
      }
    `}
  />
)
