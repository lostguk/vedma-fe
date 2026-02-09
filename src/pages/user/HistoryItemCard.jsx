import React from "react"
import { Box } from "src/components"
import { NumericFormat } from "react-number-format"

export const HistoryItemCard = ({
    img,
    price,
    name,
    count
}) => {
  return (
    <Box align="flex-start">
        <Box width="150px" marginRight="16px">
            <img src={img} style={{ maxWidth: '100%' }} /> 
        </Box>
        
        <Box justify="center" direction="column" height="100%">
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

            <Box marginTop="auto">
                Количество: {count}
            </Box>
        </Box>
    </Box>
  )
}

export default HistoryItemCard
