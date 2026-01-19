import { useEffect, useState } from "react"
import { Box, Container } from "src/components"
import { COLORS, PAGES } from "src/core/constants"
import { useNavigate } from "react-router-dom"
import Logo from "src/assets/logo.png"
import axiosClient from "src/core/axios-client"
import { useBreakpoints } from "src/core/hooks"
import { StyledFooter, FooterItem, StyledContacts } from "./styled"

export const Footer = () => {
  const [contacts, setContacts] = useState(null)

  const { table, tablet, phone } = useBreakpoints()

  const navigate = useNavigate()

  useEffect(() => {
    axiosClient.get("/pages/5").then((res) => {
      setContacts(res.data.data)
    })
  }, [])

  return (
    <StyledFooter>
      <Container>
        <Box wrap="wrap" gap="12px" width="100%">
          <Box width={table ? 'calc(25% - 12px)' : tablet ? 'calc(33.33333% - 8px)' : '100%'} align="flex-start">
            <img width="100%" src={Logo} />
          </Box>

          <Box width={table ? 'calc(25% - 12px)' : tablet ? 'calc(33.33333% - 8px)' : 'calc(50% - 6px)'} direction="column" gap="4px">
            <FooterItem onClick={() => navigate(PAGES.main)}>Главная</FooterItem>

            <FooterItem onClick={() => navigate(PAGES.catalog)}>Каталог</FooterItem>

            <FooterItem onClick={() => navigate(PAGES.delivery)}>Доставка и оплата</FooterItem>

            <FooterItem onClick={() => navigate(PAGES.exchange)}>Обмен и возврат</FooterItem>

            <FooterItem onClick={() => navigate(PAGES.contacts)}>Контакты</FooterItem>

            {
              tablet || phone && (
                <>
                  <FooterItem onClick={() => navigate(PAGES.oferta)}>Оферта</FooterItem>

                  <FooterItem onClick={() => navigate(PAGES.politics)}>Политика конфиденциальности</FooterItem>
                </>
              )
            }
          </Box>
          
          {
            table && (
              <Box width="calc(25% - 12px)" direction="column" gap="4px">
                <FooterItem onClick={() => navigate(PAGES.oferta)}>Оферта</FooterItem>

                <FooterItem onClick={() => navigate(PAGES.politics)}>Политика конфиденциальности</FooterItem>
              </Box>
            )
          }

          <Box
            width={table ? 'calc(25% - 12px)' : tablet ? 'calc(33.33333% - 8px)' : 'calc(50% - 6px)'}
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
