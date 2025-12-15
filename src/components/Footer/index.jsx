import { useEffect, useState } from "react"
import { Box, Link, Container, Button, Icon } from "src/components"
import { StyledFooter, FooterItem, StyledContacts } from "./styled"
import { COLORS } from "src/core/constants"
import Logo from "src/assets/logo.png"
import axiosClient from "src/core/axios-client"

export const Footer = () => {
  const [contacts, setContacts] = useState(null)

  useEffect(() => {
    axiosClient.get("/pages/5").then((res) => {
      setContacts(res.data.data)
    })
  }, [])

  return (
    <StyledFooter>
      <Container>
        <Box wrap="wrap" gap="12px" width="100%">
          <Box width="calc(25% - 12px)" align="flex-start">
            <img width="100%" src={Logo} />
          </Box>

          <Box width="calc(25% - 12px)" direction="column" gap="4px">
            <FooterItem>Главная</FooterItem>

            <FooterItem>Каталог</FooterItem>

            <FooterItem>Доставка и оплата</FooterItem>

            <FooterItem>Обмен и возврат</FooterItem>

            <FooterItem>Контакты</FooterItem>
          </Box>

          <Box width="calc(25% - 12px)" direction="column" gap="4px">
            <FooterItem>Оферта</FooterItem>

            <FooterItem>Политика конфиденциальности</FooterItem>
          </Box>
          <Box
            width="calc(25% - 12px)"
            borderRadius="10px"
            background={COLORS.main}
            padding="36px 24px"
            direction="column"
          >
            Контакты

             <StyledContacts
              dangerouslySetInnerHTML={{ __html: contacts?.text }}
            />
          </Box>

          <Box width="100%" justify="center" color={COLORS.main}>
            Ведьмино зелье 2024 ©
          </Box>
        </Box>
      </Container>
    </StyledFooter>
  )
}
