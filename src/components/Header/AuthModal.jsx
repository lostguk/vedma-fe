import React, { useState } from "react"
import { Modal } from "react-responsive-modal"
import { TabItem } from "src/components"
import { LoginForm } from "./LoginForm"
import { ResetPasswordForm } from "./ResetPasswordForm"
import { RegistrationForm } from "./RegistrationForm"
import { RegistrationSuccess } from "./RegistrationSuccess"
import { ResetPasswordSuccess } from "./ResetPasswordSuccess"
import { useBreakpoints } from "src/core/hooks"

const modalStates = {
  login: "login",
  registration: "registration",
  resetPassword: "resetPassword",
  registrationSuccess: "registrationSuccess",
  resetPasswordSuccess: "resetPasswordSuccess",
}

export const AuthModal = ({ toggleModal, isModalOpen }) => {
  const [modalState, setModalState] = useState(modalStates.login)

  const { table } = useBreakpoints()

  return (
    <Modal
      styles={{
        modal: {
          borderRadius: "30px",
          margin: table ? '20px' : "20px 0 0",
          width: "100%",
          maxWidth: table ? '700px' : "95vw",
        },
      }}
      open={isModalOpen}
      onClose={() => toggleModal(false)}
    >
      <TabItem tab={modalStates.login} currentTab={modalState}>
        <LoginForm
          setModalState={setModalState}
          modalStates={modalStates}
          setModalOpen={toggleModal}
        />
      </TabItem>

      <TabItem
        tab={modalStates.registration}
        currentTab={modalState}
        setModalOpen={toggleModal}
      >
        <RegistrationForm
          setModalState={setModalState}
          modalStates={modalStates}
        />
      </TabItem>

      <TabItem
        tab={modalStates.resetPassword}
        currentTab={modalState}
        setModalOpen={toggleModal}
      >
        <ResetPasswordForm
          setModalState={setModalState}
          modalStates={modalStates}
        />
      </TabItem>

      <TabItem tab={modalStates.registrationSuccess} currentTab={modalState}>
        <RegistrationSuccess setModalOpen={toggleModal} />
      </TabItem>

      <TabItem
        tab={modalStates.resetPasswordSuccess}
        currentTab={modalState}
        setModalOpen={toggleModal}
      >
        <ResetPasswordSuccess
          setModalState={setModalState}
          modalStates={modalStates}
        />
      </TabItem>
    </Modal>
  )
}
