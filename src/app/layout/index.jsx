import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Outlet } from "react-router-dom"
import { useCookies } from 'react-cookie'
import { Header, Footer, Box, AgeVerificationModal } from "src/components"

const Layout = () => {
  const { pathname } = useLocation()
  const scrollRef = useRef(null)
  const [isConfirmAgeModalOpen, setIsConfirmAgeModalOpen] = useState(false)
  const [cookies] = useCookies(['ageConfirmed'])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [pathname])

  useEffect(() => {
    if (!(cookies.ageConfirmed)) {
      setIsConfirmAgeModalOpen(true)
    } 
  }, [])

  return (
    <Box ref={scrollRef} direction="column" height="100%" background="#0A0D1B" overflow="auto">
      <AgeVerificationModal isModalOpen={isConfirmAgeModalOpen} toggleModal={() => setIsConfirmAgeModalOpen(prev => !prev)}/>

      <Header />

      <Box flexGrow={1} direction="column">
        <Outlet />
      </Box>

      <Footer />
    </Box>
  )
}

export default Layout
