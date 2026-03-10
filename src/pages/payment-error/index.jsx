import { Container, Box } from "src/components"

export const PaymentError = () => {

  return (
    <Box padding="48px 0 72px">
      <Container>
        <Box fontSize="36px" justify="center" width="100%" textAlign="center">
            При оплате произошла ошибка. <br/> Вы можете повторить попытку оплаты используя историю заказов в профиле пользователя.
        </Box>
      </Container>
    </Box>
  )
}
