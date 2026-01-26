import { Container, Box } from "src/components"

export const PaymentError = () => {

  return (
    <Box padding="48px 0 72px">
      <Container>
        <Box fontSize="16px" justify="center" width="100%">
            При оплате произошла ошибка. Вы можете повторить попытку оплаты используя историю заказов в профиле пользователя
        </Box>
      </Container>
    </Box>
  )
}
