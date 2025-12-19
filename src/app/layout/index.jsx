import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from "react-router-dom"
import { Header, Footer, Box } from "src/components"

const Layout = () => {
  const { pathname } = useLocation()
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [pathname])

  return (
    <Box ref={scrollRef} direction="column" height="100%" background="#0A0D1B" overflow="auto">
      <Header />

      <Box flexGrow={1} direction="column">
        <Outlet />
      </Box>

      <Footer />
    </Box>
  )
}

export default Layout
