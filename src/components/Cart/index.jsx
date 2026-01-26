import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { NumericFormat } from "react-number-format"
import axiosClient from "src/core/axios-client"
import { useNavigate } from "react-router-dom"
import { ICON_NAMES, PAGES } from "src/core/constants"
import { setCartTotalValue } from "src/store/slices/global/slice"

import { CartBody } from "./styled"
import { Card } from "./Card"
import { Box, Icon, Button } from "../ui"

export const Cart = ({ toggleCart }) => {
  const dispatch = useDispatch()

  const { cart, cartTotalValue } = useSelector((state) => state.global)

  const navigate = useNavigate()

  useEffect(() => {
    if (cart.length) {
      axiosClient
        .post("/order/calculate", {
          items: cart.map(({ id, count }) => ({ id, count })),
        })
        .then((res) => {
          dispatch(setCartTotalValue(res?.data?.data.total_without_discount))
        })
    }
  }, [cart])

  const productCount = cart?.reduce((acc, item) => item.count + acc, 0)

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
            <Box fontWeight="600">{productCount} товар(ов)</Box>&nbsp; на сумму
            &nbsp;
            <Box fontWeight="600">
              <NumericFormat
                displayType="text"
                value={cartTotalValue}
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
              <Card {...item} toggleCart={toggleCart} />
            </Box>
          ))
        )}
      </Box>
    </CartBody>
  )
}
