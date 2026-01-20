import React from "react"
import { format } from 'date-fns'
import { Box } from "src/components"
import { NumericFormat } from "react-number-format"
import { useBreakpoints } from "src/core/hooks"

import HistoryItemCard from './HistoryItemCard'

export const HistoryItem = ({
    address,
    created_at,
    first_name,
    items,
    last_name,
    middle_name,
    phone,
    total_price,
}) => {
  const { table, phone: phoneBreakpoint } = useBreakpoints()

  return (
    <Box direction="column" width={phoneBreakpoint ? "100%" : "calc(50% - 6px)"} background="#0A0D1B" padding={table ? "24px 40px" : "12px 20px"} borderRadius="20px">
        <Box justify="space-between" marginBottom="24px" align="center" direction={table ? 'row' : 'column'}>
            <Box fontSize="18px">
                Заказ:&nbsp;{format(new Date(created_at), 'dd.MM.yyyy')}
            </Box>

            <Box fontSize="18px" fontWeight="900">
                Сумма:&nbsp;

                <NumericFormat
                    displayType="text"
                    value={total_price}
                    suffix=" ₽"
                    thousandSeparator=" "
                />
            </Box>
        </Box>

        <Box color="white" fontSize="18px" marginBottom="4px">
            {last_name}&nbsp;{first_name}&nbsp;{middle_name}
        </Box>

        <Box color="white" fontSize="18px" marginBottom="4px">
            {address}
        </Box>

        <Box color="white" fontSize="18px" marginBottom="4px">
            {phone}
        </Box>

        <Box direction="column" gap="20px" marginTop="16px">
            {items.map(({ product: { name, price, thumb_url }}) => <HistoryItemCard img={thumb_url} price={price} name={name} />)}
        </Box>
    </Box>
  )
}

export default HistoryItem
