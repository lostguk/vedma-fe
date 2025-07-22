import React, { useEffect, useState } from "react"
import { Catalog, Container, Box, Card, Icon, TabItem } from "src/components"
import { fetchProducts, setPage } from "src/store/slices/products/slice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { PAGES } from "src/core/constants"

import { COLORS, ICON_NAMES } from "src/core/constants"

import { TabMenuItem } from "./styled"
import { UserForm } from "./UserForm"

const tabs = [
  { value: "user", label: "Моя информация" },
  { value: "history", label: "История заказов" },
  { value: "chat", label: "Чат с админом" },
]

const UserPage = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const user = useSelector((state) => state.global.user)

  const [tab, setTab] = useState(tabs[0].value)

  useEffect(() => {
    if (!user) {
      navigate(PAGES.main)
    }
  }, [])

  return (
    <Container>
      <Box direction="column">
        <Box
          color={COLORS.main}
          fontSize="40px"
          fontWeight="800"
          marginBottom="32px"
        >
          Личный кабинет
        </Box>

        <Box
          background="white"
          borderRadius="40px"
          align="center"
          gap="8px"
          padding="8px"
          marginBottom="24px"
          width="auto"
          alignSelf="flex-start"
        >
          {tabs.map(({ label, value }) => (
            <TabMenuItem
              onClick={() => setTab(value)}
              active={Boolean(value === tab)}
              color="#181E39"
              key={value}
            >
              {label}
            </TabMenuItem>
          ))}
        </Box>

        <Box borderRadius="20px" padding="16px">
          <TabItem tab={tabs[0].value} currentTab={tab}>
            <Box color="white">
              <UserForm />
            </Box>
          </TabItem>

          <TabItem tab={tabs[1].value} currentTab={tab}>
            <Box color="white">2</Box>
          </TabItem>

          <TabItem tab={tabs[2].value} currentTab={tab}>
            <Box color="white">3</Box>
          </TabItem>
        </Box>
      </Box>
    </Container>
  )
}

export default UserPage
