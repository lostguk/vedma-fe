import React from "react"
import { format } from 'date-fns'
import { Box, Button } from "src/components"
import { NumericFormat } from "react-number-format"
import { useBreakpoints } from "src/core/hooks"
import { PAGES } from "src/core/constants"
import axiosClient from "src/core/axios-client"

import HistoryItemCard from './HistoryItemCard'

export const HistoryItem = ({
    address,
    created_at,
    first_name,
    items,
    last_name,
    middle_name,
    phone,
    total_with_discount,
    status_code,
    status,
    id
}) => {
  const { table, phone: phoneBreakpoint } = useBreakpoints()

  const paymentHandler = () => {
    const currentUrl = window.location.href
    
    const url = new URL(currentUrl)

    const baseUrl = `${url.protocol}//${url.hostname}`

    axiosClient.post('/payments', {
      order_id: id,
      success_url: `${baseUrl}${PAGES.paymentSuccess}`,
      fail_url: `${baseUrl}${PAGES.paymentError}`
    })
      .then(res => {
        window.open(res?.data?.data?.payment_url)
      })
  }

  return (
    <Box direction="column" width={phoneBreakpoint ? "100%" : "calc(50% - 6px)"} background="#0A0D1B" padding={table ? "24px 40px" : "12px 20px"} borderRadius="20px">
        <Box justify="space-between" marginBottom="24px" align="flex-start" direction={table ? 'row' : 'column'}>
          <Box fontSize="18px" direction="column">
            <Box marginBottom="10px">
              Заказ:&nbsp;{format(new Date(created_at), 'dd.MM.yyyy')}
            </Box>

            <Box>
              Статус:&nbsp;{status}
            </Box>
          </Box>

          <Box fontSize="18px" fontWeight="900" direction="column">
            <Box marginBottom="20px">
                Сумма:&nbsp;

                <NumericFormat
                  displayType="text"
                  value={total_with_discount}
                  suffix=" ₽"
                  thousandSeparator=" "
                />
            </Box>

            {status_code === "payment_pending" && (
              <Button onClick={paymentHandler}>Оплатить</Button>
            )}
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
          {items.map(({ product: { name, price, thumb_url }, id, count}) => <HistoryItemCard count={count} key={id} img={thumb_url} price={price} name={name} />)}
        </Box>
    </Box>
  )
}

export default HistoryItem
