import React from "react"
import { CartBody } from "./styled"
import { Box } from "../ui"

export const Cart = () => {
  return (
    <CartBody>
      <Box fontSize="18px" color="#3A3A3A" fontWeight={600}>
        Корзина
      </Box>
    </CartBody>
  )
}
