import React from "react"
import { Button, Box, ActionButton } from "src/components"
import { useDispatch, useSelector } from "react-redux"
import { NumericFormat } from "react-number-format"
import { PAGES } from "src/core/constants"
import { generatePath, useNavigate } from "react-router-dom"
import {
  addCartItem,
  plusCartItem,
  minusCartItem,
} from "src/store/slices/global/slice"

export const Card = (props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    name = "",
    description = "",
    price = 300,
    old_price,
    id,
    slug,
    is_bestseller,
    is_new
  } = props

  const cart = useSelector((state) => state.global.cart)

  const currentItem = cart.find(({ id }) => id === props.id)

  const plusItem = () => dispatch(plusCartItem(id))

  const minusItem = () => dispatch(minusCartItem(id))

  const addToCart = () => {
    dispatch(addCartItem(props))
  }

  return (
    <Box direction="column" height="100%" position="relative" width="100%">
      <Box position='absolute' top='10px' left="10px" direction='column' gap="8px" align="start">
        {is_bestseller && (
          <Box background="#FF0000" padding="4px 8px" borderRadius="5px" fontWeight="600">Хит продаж</Box>
        )}

        {is_new && (
          <Box background="#2445D9" padding="4px 8px" borderRadius="5px" fontWeight="600">Новинка</Box>
        )}
      </Box>

      <Box
        borderRadius="20px"
        overflow="hidden"
        marginBottom="8px"
        onClick={() => navigate(generatePath(PAGES.product, { slug }))}
        cursor="pointer"
      >
        <img width="100%" src={props.thumb_url} />
      </Box>

      {/* <Box marginBottom="8px" fontSize="14px" fontWeight="400" opacity="0.5">
        {description}
      </Box> */}

      <Box marginBottom="8px">{name}</Box>

      <Box marginBottom="16px" align="flex-start">
        <Box fontSize="18px" fontWeight="600" color="#fff" marginRight="8px">
          <NumericFormat
            displayType="text"
            value={price}
            suffix=" ₽"
            thousandSeparator=" "
          />
        </Box>

        {old_price && (
          <Box
            fontSize="16px"
            fontWeight="250"
            color="#ff0000"
            textDecoration="line-through"
          >
            <NumericFormat
              displayType="text"
              value={old_price}
              suffix=" ₽"
              thousandSeparator=" "
            />
          </Box>
        )}
      </Box>

      <Box marginTop="auto" justify="center">
        {currentItem ? (
          <>
            <Box onClick={minusItem}>
              <ActionButton>-</ActionButton>
            </Box>
            <Box align="center" justify="center" margin="0 24px">
              {currentItem.count}
            </Box>
            <Box onClick={plusItem}>
              <ActionButton>+</ActionButton>
            </Box>
          </>
        ) : (
          <Button
            width="100%"
            maxWidth="200px"
            variant="secondary"
            onClick={addToCart}
          >
            В корзину
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default Card
