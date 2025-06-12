import React from "react"
import { ICON_NAMES } from "src/core/constants"
import { useSelector } from "react-redux"

import { CartBody } from "./styled"
import { Card } from "./Card"
import { Box, Icon } from "../ui"

export const Cart = ({ toggleCart }) => {
  const { cart } = useSelector((state) => state.global)

  return (
    <CartBody>
      <Box
        fontSize="18px"
        color="#3A3A3A"
        fontWeight={600}
        marginBottom="24px"
        justify="space-between"
      >
        <Box>Корзина</Box>

        <Box cursor="pointer" onClick={toggleCart}>
          <Icon name={ICON_NAMES.cross} />
        </Box>
      </Box>

      <Box direction="column" gap="16px">
        {!cart.length ? (
          <Box color="#000" margin="0 auto">
            Корзина пуста
          </Box>
        ) : (
          cart.map((item) => (
            <Box>
              <Card {...item} />
            </Box>
          ))
        )}
      </Box>
    </CartBody>
  )
}
