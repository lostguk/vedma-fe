import React, { useState } from "react"
import { Modal } from "react-responsive-modal"
import { useBreakpoints } from "src/core/hooks"
import { COLORS } from "src/core/constants"
import { Box, Button } from "src/components"
import { useCookies } from 'react-cookie'

import Logo from "src/assets/ageBG.jpg"


export const AgeVerificationModal = ({ toggleModal, isModalOpen }) => {
    
  const [cookies, setCookie] = useCookies(['ageConfirmed']);

  const { table } = useBreakpoints()

  const confirmAgeHandler = () => {
    setCookie('ageConfirmed', 'true', { path: '/', maxAge: 60 * 60 * 24 * 30 })
    toggleModal()
  }

  return (
    <Modal
      styles={{
        modal: {
          borderRadius: "30px",
          margin: table ? '20px' : "20px 0 0",
          width: "100%",
          maxWidth: table ? '1200px' : "95vw",
          padding: 0
        },
      }}
      center
      closeOnOverlayClick={false}
      showCloseIcon={false}
      open={isModalOpen}
      onClose={() => toggleModal(false)}
    >
        <Box direction="column" position="relative" align="center" background={`url('${Logo}') no-repeat center/cover #0A0D1B`} padding={table ? "100px" : "20px"}>

            <Box position="absolute" top="0" bottom="0" width="100%" background="rgba(0,0,0,0.4)" />

            <Box position="relative" color={COLORS.main} fontSize="38px"  textAlign="center">
                Внимание! Сайт содержит материалы, предназначенные только для лиц старше 18 лет.
            </Box>

            <Box position="relative" color='white' fontSize="20px"  textAlign="center" margin="28px 0 56px">
                Некоторые магические практики требуют осознанного подхода. Продолжая просмотр, вы подтверждаете свое совершеннолетие.
            </Box>

            <Box position="relative">
              <Button onClick={confirmAgeHandler} width="200px" size="large">Мне есть 18</Button>
            </Box>
        </Box>
    </Modal>
  )
}
