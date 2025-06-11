import React from "react"
import { Button, Box } from "src/components"

export const Card = ({
  name = "Свеча «Защита»",
  description = "Oчищает от негатива, ставит магический барьер.",
  price = 300,
}) => {
  return (
    <Box direction="column">
      <Box
        borderRadius="20px"
        overflow="hidden"
        marginBottom="8px"
        height="260px"
      >
        <img width="100%" src="src/assets/card-img.png" />
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

      <Box marginTop="auto">
        <Button width="100%" variant="secondary">
          В корзину
        </Button>
      </Box>
    </Box>
  )
}

export default Card
