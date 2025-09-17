import React, { useState, useEffect } from "react"
import { Box, Button, TextArea } from "src/components"
import axiosClient from "src/core/axios-client"
import { useDispatch, useSelector } from "react-redux"
import { fetchOrderHistory } from "src/store/slices/orderHistory/slice"

export const OrderHistory = () => {
  const dispatch = useDispatch()

  const { items } = useSelector((state) => state.orderHistory)

  useEffect(() => {
    dispatch(fetchOrderHistory())
  }, [])

  return (
    <Box direction="column" width="100%" align="flex-start">
      asds
    </Box>
  )
}
