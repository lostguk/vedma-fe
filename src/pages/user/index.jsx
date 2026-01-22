import React, { useEffect, useState } from "react"
import { Container, Box, TabItem, Icon } from "src/components"
import { useNavigate } from "react-router-dom"
import { PAGES } from "src/core/constants"
import { getToken } from "src/core/axios-client"
import { useBreakpoints } from "src/core/hooks"

import { COLORS, ICON_NAMES } from "src/core/constants"

import { TabMenuItem } from "./styled"
import { UserForm } from "./UserForm"
import { ChangePasswordForm } from "./ChangePasswordForm"
import { Chat } from "./Chat"
import { OrderHistory } from "./OrderHistory"

const tabs = [
  { value: "user", label: "Моя информация", icon: ICON_NAMES.orderHistory },
  { value: "history", label: "История заказов", icon: ICON_NAMES.myInfo },
  { value: "chat", label: "Чат с админом", icon: ICON_NAMES.chat },
  { value: "changePassword", label: "Изменить пароль", icon: ICON_NAMES.changePassword },
]
              
export const UserPage = () => {
  const navigate = useNavigate()

  const { table, tablet, phone } = useBreakpoints()

  const [tab, setTab] = useState(tabs[0].value)

  useEffect(() => {
    if (!getToken()) {
      navigate(PAGES.main)
    }
  }, [])

  return (
    <Container>
      <Box direction="column" width="100%">
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
          width={phone ? "100%" : 'auto'}
          alignSelf="flex-start"
          justify="space-evenly"
        >
          {tabs.map(({ label, value, icon }) => (
            <TabMenuItem
              onClick={() => setTab(value)}
              active={Boolean(value === tab)}
              color="#181E39"
              key={value}
            >
              {phone ? <Icon name={icon} color={tab === value ? "#ffffff": "#000000"}/> : label}
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
            <OrderHistory />
          </TabItem>

          <TabItem tab={tabs[2].value} currentTab={tab}>
            <Chat />
          </TabItem>

          <TabItem tab={tabs[3].value} currentTab={tab}>
            <ChangePasswordForm />
          </TabItem>
        </Box>
      </Box>
    </Container>
  )
}
