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
import { useBreakpoints } from "src/core/hooks"
import { COLORS, ICON_NAMES, MODAL_NAMES, PAGES, HEADER_LINKS } from "src/core/constants"
import { setCart } from "src/core/helpers"
import { setUser } from "src/store/slices/global/slice"
import { toggleModal } from "src/store/slices/modals/slice"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import axiosClient, { getToken } from "src/core/axios-client"
import Logo from "src/assets/logo.png"

import { StyledHeader } from "./styled"
import { AuthModal } from "./AuthModal"
import { MobileMenu } from "./MobileMenu"

export const Header = () => {
  const dispatch = useDispatch()
  const [isCartOpen, setCartOpen] = useState(false)
  const [isMobileMenu, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { table, tablet, phone } = useBreakpoints()

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
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev)

  return (
    <StyledHeader>
      <SidePage isOpen={isCartOpen} toggle={toggleCart} width={phone ? 420 : 500}>
        <Cart toggleCart={toggleCart} />
      </SidePage>

      <SidePage isOpen={isMobileMenu} toggle={toggleMobileMenu}>
        <MobileMenu toggleMenu={toggleMobileMenu} />
      </SidePage>

      {authModal.isOpen && (
        <AuthModal
          isModalOpen={authModal.isOpen}
          toggleModal={toggleAuthModal}
        />
      )}

      <Container>
        <Box width="100%">
          {(table || tablet) && (
            <Box gap="24px" justify={table ? 'flex-start' : 'space-between'} width="100%">
              {HEADER_LINKS.map(({ link, title }) => (
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
          )}

          {table && (
            <Box color="white" fontWeight={250} marginLeft="auto" flexShrink={0}>
              Пн-пт с 12-00 до 19-00
            </Box>
          )}

          
          {phone && (
              <Box color="#fff" margin="0 auto">
                <Link
                  to={PAGES.main}
                >
                  <img width="100%" src={Logo} />
                </Link>
              </Box>
            )}
        </Box>

        <Box width="100%" align="center" marginTop="16px">
          {(table || tablet) && (
            <Box color="#fff">
              <Link
                to={PAGES.main}
              >
                <img width="100%" src={Logo} />
              </Link>
            </Box>
          )}
          
          {phone && (
            <Button variant="primary" onClick={toggleMobileMenu}>
              <Icon name={ICON_NAMES.mobileMenu} />
            </Button>
          )}

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
            

            {(table || tablet) && (
              <a href="tel:+89604921669">
                <Box fontSize={table ? '20px' : '16px'} color="#fff" marginLeft="16px">
                  +8 (960) 492-16-69
                </Box>
              </a>
            )}
          </Box>
        </Box>
      </Container>
    </StyledHeader>
  )
}
