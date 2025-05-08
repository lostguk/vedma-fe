import React, { useState } from "react"
import { Box, Link, Container, Button, Icon, Input } from "src/components"
import { COLORS, ICON_NAMES, PAGES } from "src/core/constants"
import { Modal } from "react-responsive-modal"
import { StyledHeader } from "./styled"
import { LoginForm } from "./LoginForm"
import { ResetPasswordForm } from "./ResetPasswordForm"
import { RegistrationForm } from "./RegistrationForm"

const links = [
  {
    link: PAGES.main,
    title: "Главная",
  },
  {
    link: PAGES.catalog,
    title: "Каталог",
  },
  {
    link: PAGES.delivery,
    title: "Доставка и оплата",
  },
  {
    link: PAGES.exchange,
    title: "Обмен и возврат",
  },
  {
    link: PAGES.contacts,
    title: "Контакты",
  },
]

export const Header = () => {
  const [isModalOpen, setModalOpen] = useState(false)

  return (
    <StyledHeader>
      <Modal
        styles={{
          modal: {
            borderRadius: "30px",
            width: "100%",
            maxWidth: "700px",
          },
        }}
        center={true}
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <RegistrationForm />
      </Modal>

      <Container>
        <Box width="100%">
          <Box gap="24px">
            {links.map(({ link, title }) => (
              <Box color="white" key={title}>
                <Link
                  to={link}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  activeColor={COLORS.main}
                >
                  {title}
                </Link>
              </Box>
            ))}
          </Box>
          <Box color="white" fontWeight={250} marginLeft="auto">
            Пн-пт с 12-00 до 19-00
          </Box>
        </Box>
        <Box width="100%" align="center" marginTop="16px">
          <Box color="#fff">
            <img width="100%" src="src/assets/logo.png" />
          </Box>

          <Box marginLeft="auto" gap="8px" align="center">
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              <Icon name={ICON_NAMES.profile} />
            </Button>

            <Button variant="secondary">
              <Box align="center">
                <Icon name={ICON_NAMES.basket} />
                &nbsp; Корзина
              </Box>
            </Button>

            <a href="tel:+89604921669">
              <Box fontSize="24px" color="#fff" marginLeft="16px">
                +8 (960) 492-16-69
              </Box>
            </a>
          </Box>
        </Box>
      </Container>
    </StyledHeader>
  )
}
