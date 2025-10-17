import { useEffect, useState } from "react"
import axiosClient from "src/core/axios-client"
import { Container, Box, Button, Icon } from "src/components"
import { useNavigate } from "react-router-dom"
import { PAGES } from "src/core/constants"
import { useSearchParams } from "react-router-dom"
import { ICON_NAMES } from "src/core/constants"

const VerifyEmailPage = () => {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [isWrong, setIsWrong] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [searchParams] = useSearchParams()

  const hash = searchParams.get("hash")
  const signature = searchParams.get("signature")
  const expires = searchParams.get("expires")

  console.log(hash, signature, expires)

  useEffect(() => {
    if (!hash || !signature || !expires) {
      console.log(1)
      setIsWrong(true)
      setIsLoading(false)
    } else if (new Date(expires * 1000) < new Date()) {
      console.log(2)
      setIsExpired(true)
      setIsLoading(false)
    } else {
      console.log(3)
      axiosClient
        .get(`/verify-registration/${signature}/${hash}`)
        .then((res) => {
          setIsSuccess(true)
          setIsLoading(false)
        })
        .catch(() => setIsWrong(true))
        .finally(() => setIsLoading(false))
    }
  }, [])
  return (
    <Box padding="48px 0 72px">
      <Container>
        <Box width="100%" gap="40px">
          {isLoading && (
            <Box width="200px" margin="0 auto">
              <Icon name={ICON_NAMES.loader} />
            </Box>
          )}

          {!isLoading && isSuccess && (
            <Box width="100%" direction="column">
              <Box
                fontSize="50px"
                color="white"
                fontWeight="900"
                paddingRight="48px"
                justify="center"
              >
                Email успешно подтвержден
              </Box>

              <Box
                fontSize="48px"
                color="white"
                marginTop="40px"
                fontWeight="900"
                marginBottom="24px"
                justify="center"
              >
                <Button onClick={() => navigate(PAGES.main)}>На главную</Button>
              </Box>
            </Box>
          )}

          {!isLoading && isExpired && (
            <Box width="100%" direction="column">
              <Box
                fontSize="50px"
                color="white"
                fontWeight="900"
                paddingRight="48px"
                justify="center"
              >
                Ссылка устарела, повторите регистрацию
              </Box>

              <Box
                fontSize="48px"
                color="white"
                marginTop="40px"
                fontWeight="900"
                marginBottom="24px"
                justify="center"
              >
                <Button onClick={() => navigate(PAGES.main)}>На главную</Button>
              </Box>
            </Box>
          )}

          {!isLoading && isWrong && (
            <Box width="100%" direction="column">
              <Box
                fontSize="50px"
                color="white"
                fontWeight="900"
                paddingRight="48px"
                justify="center"
              >
                Что-то пошло не так
              </Box>

              <Box
                fontSize="48px"
                color="white"
                marginTop="40px"
                fontWeight="900"
                marginBottom="24px"
                justify="center"
              >
                <Button onClick={() => navigate(PAGES.main)}>На главную</Button>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default VerifyEmailPage
