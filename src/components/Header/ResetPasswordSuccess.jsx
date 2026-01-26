import { Box } from "src/components"
import { useBreakpoints } from "src/core/hooks"

export const ResetPasswordSuccess = () => {
  const { table } = useBreakpoints()

  return (
    <Box padding={table ? "32px" : '8px'} direction="column" color="black">
      <Box fontSize={table ? "40px" : "24px"} color="#292929" marginBottom="16px">
        Запрос на восстановление отправлен
      </Box>

      <Box fontSize="24px" color="#292929" marginBottom="16px">
        Следуйте иструкциям в письме, отправленным на почту
      </Box>
    </Box>
  )
}
