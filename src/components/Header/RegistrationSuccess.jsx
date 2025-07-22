import { Box, Button } from "src/components"

export const RegistrationSuccess = ({ modalStates, setModalState }) => {
  return (
    <Box padding="32px" direction="column" color="black">
      <Box fontSize="40px" color="#292929" marginBottom="16px">
        Регистрация завершена
      </Box>

      <Box fontSize="24px" color="#292929" marginBottom="16px">
        Для завершения регистрации подтвердите почту
      </Box>

      <Box width="100$" justify="center" marginTop="24px">
        <Button size="large">Закрыть</Button>
      </Box>
    </Box>
  )
}
