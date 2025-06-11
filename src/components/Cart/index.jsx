import React from "react"
import { CartBody } from "./styled"
import { Card } from "./Card"
import { Box, Icon } from "../ui"
import { ICON_NAMES } from "src/core/constants"

export const Cart = ({ toggleCart }) => {
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

      <Box direction="column">
        <Box>
          <Card />
        </Box>

        <Box>
          <Card />
        </Box>
      </Box>
    </CartBody>
  )
}
