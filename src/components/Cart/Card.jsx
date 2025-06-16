import React from "react"
import { Button, Box, Icon } from "src/components"
import { ActionButton } from "./styled"
import { ICON_NAMES } from "src/core/constants"
import { useDispatch } from "react-redux"
import {
  removeCartItem,
  plusCartItem,
  minusCartItem,
} from "src/store/slices/global/slice"

export const Card = (props) => {
  const dispatch = useDispatch()

  const removeProduct = () => dispatch(removeCartItem(props.id))

  const plusItem = () => dispatch(plusCartItem(props.id))

  const minusItem = () => dispatch(minusCartItem(props.id))

  return (
    <Box width="100%" align="flex-end" position="relative">
      <Box
        onClick={removeProduct}
        cursor="pointer"
        position="absolute"
        top="0"
        right="0"
        borderRadius="5px"
        justify="center"
        aling="center"
        background="rgba(246, 178, 115, .2)"
        padding="8px"
      >
        <Icon name={ICON_NAMES.cross} color="#FF0000" />
      </Box>

      <Box
        borderRadius="20px"
        overflow="hidden"
        marginBottom="8px"
        height="260px"
        width="35%"
      >
        <img width="100%" src={props.thumb_url} />
      </Box>

      <Box width="45%" padding="0 16px" direction="column" marginBottom="5px">
        <Box
          fontSize="28px"
          fontWeight="600"
          color="#3A3A3A"
          marginRight="8px"
          align="flex-end"
        >
          {props.price}₽
          <Box
            fontSize="14px"
            fontWeight="600"
            color="#000000"
            opacity="0.5"
            margin="0 0 3px 5px"
          >
            цена за штуку
          </Box>
        </Box>

        <Box
          fontSize="18px"
          fontWeight="600"
          color="#000000"
          margin="3px 0 0 5px"
        >
          {props.name}
        </Box>
      </Box>

      <Box width="20%">
        <Box onClick={minusItem}>
          <ActionButton>-</ActionButton>
        </Box>
        <Box color="#000" align="center" justify="center" margin="0 auto">
          {props.count}
        </Box>
        <Box onClick={plusItem}>
          <ActionButton>+</ActionButton>
        </Box>
      </Box>
    </Box>
  )
}

export default Card
