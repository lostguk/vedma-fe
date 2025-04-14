import { Outlet, useNavigate } from "react-router-dom"
import { Header, Footer, Box } from "src/components"

const Layout = () => {
  return (
    <Box direction="column" height="100%" background="#0A0D1B">
      <Header />

      <Box flexGrow={1}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  )
}

export default Layout
