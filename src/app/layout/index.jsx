import { Outlet } from "react-router-dom"
import { Header, Footer, Box } from "src/components"

const Layout = () => {
  return (
    <Box direction="column" height="100%" background="#0A0D1B" overflow="auto">
      <Header />

      <Box flexGrow={1} direction="column">
        <Outlet />
      </Box>

      <Footer />
    </Box>
  )
}

export default Layout
