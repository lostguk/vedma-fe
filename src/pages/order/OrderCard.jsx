import React from "react"
import { Button, Box, Icon } from "src/components"
import { ICON_NAMES } from "src/core/constants"
import { useDispatch } from "react-redux"
import { NumericFormat } from "react-number-format"
import {
  removeCartItem,
  plusCartItem,
  minusCartItem,
} from "src/store/slices/global/slice"

import styled from "@emotion/styled"

export const ActionButton = styled.div`
  display: flex;
  width: 30px;
  height: 30px;
  padding: 8px;
  align-items: center;
  justify-content: center;
  color: #a5a5a5;
  border-radius: 5px;
  border: 1px solid #a5a5a5;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`

export const Card = (props) => {
  const dispatch = useDispatch()

  const removeProduct = () => dispatch(removeCartItem(props.id))

  const plusItem = () => dispatch(plusCartItem(props.id))

  const minusItem = () => dispatch(minusCartItem(props.id))

  return (
    <Box
      width="100%"
      position="relative"
      padding="8px 0"
      borderBottom="1px solid rgba(210, 210, 210, 0.3)"
    >
      <Box
        width="20px"
        onClick={removeProduct}
        cursor="pointer"
        position="absolute"
        top="10px"
        right="0"
        borderRadius="5px"
        justify="center"
        aling="center"
        background="rgba(246, 178, 115, .2)"
        padding="4px"
      >
        <Icon name={ICON_NAMES.cross} color="#FF0000" />
      </Box>

      <Box
        borderRadius="20px"
        overflow="hidden"
        marginBottom="8px"
        width="100%%"
        maxWidth="140px"
      >
        <img width="100%" src={props.thumb_url} />
      </Box>

      <Box flexGrow={1} padding="0 16px" direction="column" marginBottom="5px">
        <Box width="100%" marginBottom="auto" maxWidth="90px">
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

        <Box
          fontSize="22px"
          fontWeight="600"
          color="#3A3A3A"
          marginRight="8px"
          align="flex-end"
        >
          <NumericFormat
            displayType="text"
            value={props.price}
            suffix=" ₽"
            thousandSeparator=" "
          />

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
      </Box>
    </Box>
  )
}

export default Card
