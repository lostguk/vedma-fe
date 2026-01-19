import { Box, Link, Icon } from "src/components"
import { COLORS, ICON_NAMES, MODAL_NAMES, PAGES, HEADER_LINKS } from "src/core/constants"
import Logo from "src/assets/logo.png"

export const MobileMenu = ({ toggleMenu }) => {

  return (
    <Box direction="column" background="#0A0D1B" height="100%" padding="12px 32px">
      <Box justify="space-between" align="center">
        <Box>
          <Link
            to={PAGES.main}
          >
            <img width="100%" src={Logo} />
          </Link>
        </Box>

        <Box cursor="pointer" onClick={toggleMenu}>
          <Icon name={ICON_NAMES.cross} color="#fff" />
        </Box>
      </Box>

      <Box direction="column" gap="12px" align="flex-start" marginTop="32px">
        {HEADER_LINKS.map(({ link, title }) => (
            <Box color="#fff" key={title} fontSize="20px">
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

      <Box marginTop="auto" justify="center">
            Ведьмино зелье 2024 ©
      </Box>
    </Box>
  )
}
