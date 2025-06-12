import React from "react"
import { Button, Box } from "src/components"
import { useDispatch, useSelector } from "react-redux"
import {
  addCartItem,
  plusCartItem,
  minusCartItem,
} from "src/store/slices/global/slice"

import { ActionButton } from "./styled"

export const Card = (props) => {
  const dispatch = useDispatch()

  const {
    name = "Свеча «Защита»",
    description = "Oчищает от негатива, ставит магический барьер.",
    price = 300,
    id,
  } = props

  const cart = useSelector((state) => state.global.cart)

  const currentItem = cart.find(({ id }) => id === props.id)

  const plusItem = () => dispatch(plusCartItem(props.id))

  const minusItem = () => dispatch(minusCartItem(props.id))

  const addToCart = () => {
    dispatch(addCartItem(props))
  }

  return (
    <Box direction="column">
      <Box
        borderRadius="20px"
        overflow="hidden"
        marginBottom="8px"
        height="260px"
      >
        <img width="100%" src={props.images_urls[0]} />
      </Box>

      <Box marginBottom="8px" fontSize="14px" fontWeight="400" opacity="0.5">
        {description}
      </Box>

      <Box marginBottom="8px">{name}</Box>

      <Box marginBottom="16px" aling="flex-start">
        <Box fontSize="18px" fontWeight="600" color="#fff" marginRight="8px">
          {price}₽
        </Box>

        <Box
          fontSize="16px"
          fontWeight="250"
          color="#ff0000"
          textDecoration="line-through"
        >
          700₽
        </Box>
      </Box>

      <Box marginTop="auto" justify="center">
        {currentItem ? (
          <>
            <Box onClick={minusItem}>
              <ActionButton>-</ActionButton>
            </Box>
            <Box align="center" justify="center" margin="0 32px">
              {currentItem.count}
            </Box>
            <Box onClick={plusItem}>
              <ActionButton>+</ActionButton>
            </Box>
          </>
        ) : (
          <Button width="100%" variant="secondary" onClick={addToCart}>
            В корзину
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default Card
