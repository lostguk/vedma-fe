import { useEffect, useState } from "react"
import axiosClient from "src/core/axios-client"
import { Container, Box, Icon } from "src/components"
import { useDispatch } from "react-redux"
import { ICON_NAMES } from "src/core/constants"

export const PoliticsPage = () => {
  const [page, setPage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    axiosClient.get("/pages/7").then((res) => {
      setPage(res.data.data)
      setIsLoading(false)
    })
  }, [])

  return (
    <Box padding="48px 0 72px">
      <Container>
        <Box width="100%" gap="40px">
          {isLoading ? (
            <Box width="200px" margin="0 auto">
              <Icon name={ICON_NAMES.loader} />
            </Box>
          ) : (
            <Box width="100%" direction="column">
              <Box
                fontSize="68px"
                color="white"
                fontWeight="900"
                paddingRight="48px"
              >
                {page?.title}
              </Box>

              <Box
                fontSize="48px"
                color="white"
                fontWeight="900"
                marginBottom="24px"
              >
                {page?.description}
              </Box>

              <Box
                dangerouslySetInnerHTML={{ __html: page?.text }}
                direction="column"
              />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}
