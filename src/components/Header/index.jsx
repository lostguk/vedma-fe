import React, { useState } from "react"
import { Box, Link, Container, Button, Icon, Cart } from "src/components"
import { COLORS, ICON_NAMES, PAGES } from "src/core/constants"
import { Modal } from "react-responsive-modal"
import { StyledHeader } from "./styled"
import { AuthModal } from "./AuthModal"

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
  const [isCartOpen, setCartOpen] = useState(false)

  const toggleCart = () => setCartOpen((prev) => !prev)

  return (
    <StyledHeader>
      {isCartOpen && <Cart toggleCart={toggleCart} />}

      {isModalOpen && (
        <AuthModal isModalOpen={isModalOpen} setModalOpen={setModalOpen} />
      )}

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

            <Button variant="secondary" onClick={toggleCart}>
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
