import { Box, Link, Container, Button, Icon } from "src/components"
import { StyledFooter, FooterItem } from "./styled"
import { COLORS } from "src/core/constants"

export const Footer = () => {
  return (
    <StyledFooter>
      <Container>
        <Box wrap="wrap" gap="12px" width="100%">
          <Box width="calc(25% - 12px)" align="flex-start">
            <img width="100%" src="src/assets/logo.png" />
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
          >
            Контакты
          </Box>

          <Box width="100%" justify="center" color={COLORS.main}>
            Ведьмино зелье 2024 ©
          </Box>
        </Box>
      </Container>
    </StyledFooter>
  )
}
