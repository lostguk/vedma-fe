import { Box, Button } from "src/components"
import { useBreakpoints } from "src/core/hooks"

export const RegistrationSuccess = ({ setModalOpen }) => {
  const { table } = useBreakpoints()

  return (
    <Box padding={table ? "32px" : '8px'} direction="column" color="black">
      <Box fontSize={table ? "40px" : "24px"} color="#292929" marginBottom="16px">
        Регистрация завершена
      </Box>

      <Box fontSize="24px" color="#292929" marginBottom="16px">
        Для завершения регистрации подтвердите почту
      </Box>

      <Box width="100$" justify="center" marginTop="24px">
        <Button onClick={() => setModalOpen(false)} size="large">
          Закрыть
        </Button>
      </Box>
    </Box>
  )
}
