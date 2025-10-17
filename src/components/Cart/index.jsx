import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { NumericFormat } from "react-number-format"
import axiosClient from "src/core/axios-client"
import { useNavigate } from "react-router-dom"
import { ICON_NAMES, PAGES } from "src/core/constants"

import { CartBody } from "./styled"
import { Card } from "./Card"
import { Box, Icon, Button } from "../ui"

export const Cart = ({ toggleCart }) => {
  const { cart } = useSelector((state) => state.global)

  const navigate = useNavigate()

  const [totalCartPrice, setTotalCartPrice] = useState(0)

  useEffect(() => {
    if (cart.length) {
      axiosClient
        .post("/order/calculate", {
          items: cart.map(({ id, count }) => ({ id, count })),
        })
        .then((res) => {
          setTotalCartPrice(
            res?.data?.data.reduce((acc, item) => item.summery + acc, 0),
          )
        })
    }
  }, [cart])

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

      {Boolean(cart.length) && (
        <Box direction="column" align="center" marginBottom="32px">
          <Box
            fontSize="16px"
            fontWeight="400"
            color="#3A3A3A"
            marginBottom="16px"
          >
            В корзине &nbsp;
            <Box fontWeight="600">{cart.length} товар(ов)</Box>&nbsp; на сумму
            &nbsp;
            <Box fontWeight="600">
              <NumericFormat
                displayType="text"
                value={totalCartPrice}
                suffix=" ₽"
                thousandSeparator=" "
              />
            </Box>
          </Box>

          <Button
            onClick={() => {
              navigate(PAGES.order)
              toggleCart()
            }}
          >
            Оформить заказ
          </Button>
        </Box>
      )}

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
