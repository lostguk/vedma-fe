import React from "react"
import { Box, Icon, ActionButton } from "src/components"
import { ICON_NAMES, PAGES, COLORS } from "src/core/constants"
import { useDispatch } from "react-redux"
import { NumericFormat } from "react-number-format"
import { generatePath, useNavigate } from "react-router-dom"
import {
  removeCartItem,
  plusCartItem,
  minusCartItem,
} from "src/store/slices/global/slice"

export const Card = (props) => {
  const dispatch = useDispatch()
    const navigate = useNavigate()

  const removeProduct = () => dispatch(removeCartItem(props.id))

  const plusItem = () => dispatch(plusCartItem(props.id))

  const minusItem = () => dispatch(minusCartItem(props.id))

  const navigateToProduct = () => {
    props.toggleCart()
    navigate(generatePath(PAGES.product, { slug: props.slug }))
  }

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

      <Box cursor="pointer" borderRadius="20px" overflow="hidden" width="35%" onClick={navigateToProduct}>
        <img width="100%" src={props.thumb_url} />
      </Box>

      <Box
        width="45%"
        padding="0 16px"
        direction="column"
        marginBottom="5px"
        alignSelf="flex-start"
        height="100%"
      >
        <Box
          cursor="pointer"
          fontSize="18px"
          fontWeight="600"
          color="#000000"
          margin="0 0 8px 4px"
          onClick={navigateToProduct}
          hoverStyles={{
            color: COLORS.main
          }}
          transition="all 0.3s"
        >
          {props.name}
        </Box>

        <Box
          fontSize="16px"
          fontWeight="600"
          color="#3A3A3A"
          direction="column"
          marginTop="auto"
        >
          <NumericFormat
            displayType="text"
            value={props.price}
            suffix=" ₽"
            thousandSeparator=" "
          />

          <Box
            fontSize="12px"
            fontWeight="600"
            color="#000000"
            opacity="0.5"
            marginTop="4px"
          >
            цена за штуку
          </Box>
        </Box>
      </Box>

      <Box width="20%" maxWidth="105px" marginLeft="auto">
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
