import React from "react"
import { Button, Box } from "src/components"
import { ActionButton } from "./styled"

export const Card = () => {
  return (
    <Box width="100%" align="flex-end">
      <Box
        borderRadius="20px"
        overflow="hidden"
        marginBottom="8px"
        height="260px"
        width="35%"
      >
        <img width="100%" src="src/assets/card-img.png" />
      </Box>

      <Box width="45%" padding="0 16px" direction="column" marginBottom="5px">
        <Box
          fontSize="28px"
          fontWeight="600"
          color="#3A3A3A"
          marginRight="8px"
          align="flex-end"
        >
          300₽
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
          Свеча «Любовь»
        </Box>
      </Box>

      <Box width="20%">
        <Box>
          <ActionButton>-</ActionButton>
        </Box>
        <Box color="#000" align="center" justify="center" margin="0 auto">
          1
        </Box>
        <Box>
          <ActionButton>+</ActionButton>
        </Box>
      </Box>
    </Box>
  )
}

export default Card
