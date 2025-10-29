import React, { useEffect, useState } from "react"
import {
  Box,
  Link,
  Container,
  Button,
  Icon,
  Cart,
  SidePage,
  Badge,
} from "src/components"
import { COLORS, ICON_NAMES, MODAL_NAMES, PAGES } from "src/core/constants"
import { setCart } from "src/core/helpers"
import { setUser } from "src/store/slices/global/slice"
import { toggleModal } from "src/store/slices/modals/slice"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import axiosClient, { getToken } from "src/core/axios-client"
import Logo from "src/assets/logo.png"

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
  const dispatch = useDispatch()
  const [isModalOpen, setModalOpen] = useState(false)
  const [isCartOpen, setCartOpen] = useState(false)
  const navigate = useNavigate()

  const { authModal } = useSelector((state) => state.modals)
  const { cart, user } = useSelector((state) => state.global)

  const toggleAuthModal = (isOpen) =>
    dispatch(toggleModal({ name: MODAL_NAMES.authModal, isOpen }))

  const onProfileClick = () => {
    if (Boolean(user)) {
      navigate(PAGES.user)
    } else {
      toggleAuthModal(true)
    }
  }

  useEffect(() => {
    setCart(cart)
  }, [cart])

  useEffect(() => {
    if (getToken()) {
      axiosClient
        .get("/profile")
        .then((res) => dispatch(setUser(res.data.data)))
    }
  }, [])

  const toggleCart = () => setCartOpen((prev) => !prev)

  return (
    <StyledHeader>
      {isCartOpen && (
        <SidePage isOpen={isCartOpen} toggle={toggleCart}>
          <Cart toggleCart={toggleCart} />
        </SidePage>
      )}

      {authModal.isOpen && (
        <AuthModal
          isModalOpen={authModal.isOpen}
          toggleModal={toggleAuthModal}
        />
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
            <img width="100%" src={Logo} />
          </Box>

          <Box marginLeft="auto" gap="8px" align="center">
            <Button variant="secondary" onClick={onProfileClick}>
              {Boolean(user) ? <Icon name={ICON_NAMES.profile} /> : "Войти"}
            </Button>

            <Button variant="secondary" onClick={toggleCart}>
              <Box align="center">
                <Icon name={ICON_NAMES.basket} />
                &nbsp; Корзина &nbsp;
                {Boolean(cart?.length) && <Badge>{cart?.length}</Badge>}
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
