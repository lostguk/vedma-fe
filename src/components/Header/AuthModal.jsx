import React, { useState } from "react"
import { Modal } from "react-responsive-modal"
import { TabItem } from "src/components"
import { LoginForm } from "./LoginForm"
import { ResetPasswordForm } from "./ResetPasswordForm"
import { RegistrationForm } from "./RegistrationForm"
import { RegistrationSuccess } from "./RegistrationSuccess"
import { ResetPasswordSuccess } from "./ResetPasswordSuccess"

const modalStates = {
  login: "login",
  registration: "registration",
  resetPassword: "resetPassword",
  registrationSuccess: "registrationSuccess",
  resetPasswordSuccess: "resetPasswordSuccess",
}

export const AuthModal = ({ setModalOpen, isModalOpen }) => {
  const [modalState, setModalState] = useState(modalStates.login)

  return (
    <Modal
      styles={{
        modal: {
          borderRadius: "30px",
          width: "100%",
          maxWidth: "700px",
        },
      }}
      open={isModalOpen}
      onClose={() => setModalOpen(false)}
    >
      <TabItem tab={modalStates.login} currentTab={modalState}>
        <LoginForm
          setModalState={setModalState}
          modalStates={modalStates}
          setModalOpen={setModalOpen}
        />
      </TabItem>

      <TabItem
        tab={modalStates.registration}
        currentTab={modalState}
        setModalOpen={setModalOpen}
      >
        <RegistrationForm
          setModalState={setModalState}
          modalStates={modalStates}
        />
      </TabItem>

      <TabItem
        tab={modalStates.resetPassword}
        currentTab={modalState}
        setModalOpen={setModalOpen}
      >
        <ResetPasswordForm
          setModalState={setModalState}
          modalStates={modalStates}
        />
      </TabItem>

      <TabItem tab={modalStates.registrationSuccess} currentTab={modalState}>
        <RegistrationSuccess setModalOpen={setModalOpen} />
      </TabItem>

      <TabItem
        tab={modalStates.resetPasswordSuccess}
        currentTab={modalState}
        setModalOpen={setModalOpen}
      >
        <ResetPasswordSuccess
          setModalState={setModalState}
          modalStates={modalStates}
        />
      </TabItem>
    </Modal>
  )
}
