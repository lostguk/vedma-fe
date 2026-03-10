import { useEffect, useState } from "react"
import axiosClient from "src/core/axios-client"
import { Container, Box, Button, Icon } from "src/components"
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { PAGES } from "src/core/constants"
import { ICON_NAMES } from "src/core/constants"

export const VerifyEmailPage = () => {
  const navigate = useNavigate()

  const location = useLocation()
  
  const queryParams = new URLSearchParams(location.search);

  const expires = queryParams.get('expires')

  const signature = queryParams.get('signature')

  const [isLoading, setIsLoading] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { user, hash } = useParams()

  useEffect(() => {
    if(new Date(Number(expires) * 1000) < new Date()){
      setIsExpired(true)
    } else {
      axiosClient
        .get(`/verify-registration/${user}/${hash}`, { params: { expires, signature }})
        .then((res) => {
          setIsSuccess(true)
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
