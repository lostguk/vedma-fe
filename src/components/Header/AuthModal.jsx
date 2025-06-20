import React, { useState } from "react"
import { Modal } from "react-responsive-modal"
import { TabItem } from "src/components"
import { LoginForm } from "./LoginForm"
import { ResetPasswordForm } from "./ResetPasswordForm"
import { RegistrationForm } from "./RegistrationForm"

const modalStates = {
  login: "login",
  regisration: "regisration",
  resetPassword: "resetPassword",
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
        <LoginForm setModalState={setModalState} modalStates={modalStates} />
      </TabItem>

      <TabItem tab={modalStates.regisration} currentTab={modalState}>
        <RegistrationForm
          setModalState={setModalState}
          modalStates={modalStates}
        />
      </TabItem>

      <TabItem tab={modalStates.resetPassword} currentTab={modalState}>
        <ResetPasswordForm
          setModalState={setModalState}
          modalStates={modalStates}
        />
      </TabItem>
    </Modal>
  )
}
