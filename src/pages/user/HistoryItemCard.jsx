import React from "react"
import { Box } from "src/components"
import { NumericFormat } from "react-number-format"

export const HistoryItemCard = ({
    img,
    price,
    name
}) => {
  return (
    <Box>
        <Box width="75px" marginRight="16px">
            <img src={img} style={{ maxWidth: '100%' }} /> 
        </Box>

        <Box justify="center" color="#3A3A3A" direction="column">
            <Box fontSize="22px" marginBottom="4px">
                <NumericFormat
                    displayType="text"
                    value={price}
                    suffix=" ₽"
                    thousandSeparator=" "
                />
            </Box>
            
            <Box fontSize="14px">
                {name}
            </Box>
        </Box>
    </Box>
  )
}

export default HistoryItemCard
