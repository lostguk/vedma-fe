import { Box } from "src/components"

export const ResetPasswordSuccess = ({ modalStates, setModalState }) => {
  return (
    <Box padding="32px" direction="column" color="black">
      <Box fontSize="40px" color="#292929" marginBottom="16px">
        Запрос на восстановление отправлен
      </Box>

      <Box fontSize="24px" color="#292929" marginBottom="16px">
        Следуйте иструкциям в письме, отправленным на почту
      </Box>
    </Box>
  )
}
