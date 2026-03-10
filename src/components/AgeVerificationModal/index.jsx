import React, { useState } from "react"
import { Modal } from "react-responsive-modal"
import { useBreakpoints } from "src/core/hooks"
import { COLORS } from "src/core/constants"
import { Box, Button } from "src/components"
import { useCookies } from 'react-cookie'

import Logo from "src/assets/dark-cloud.png"


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
        <Box direction="column" align="center" background={`url('${Logo}') no-repeat center/contain #0A0D1B`} padding={table ? "40px" : "20px"}>
            <Box marginBottom="55px" borderRadius="40px" color={COLORS.main} fontSize="65px" border={`2px solid ${COLORS.main}!important`} width="140px" height="190px" align="center" justify="center">
                18 +
            </Box>

            <Box color={COLORS.main} fontSize="38px"  textAlign="center">
                Внимание! Сайт содержит материалы, предназначенные только для лиц старше 18 лет.
            </Box>

            <Box color='white' fontSize="20px"  textAlign="center" margin="28px 0 56px">
                Некоторые магические практики требуют осознанного подхода. Продолжая просмотр, вы подтверждаете свое совершеннолетие.
            </Box>

            <Button onClick={confirmAgeHandler} width="200px" size="large">Мне есть 18</Button>
        </Box>
    </Modal>
  )
}
