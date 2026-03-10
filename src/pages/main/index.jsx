import React, { useEffect } from "react"
import { Container, Button, Box, Card } from "src/components"
import { COLORS, PAGES } from "src/core/constants"
import { useDispatch, useSelector } from "react-redux"
import { fetchCandels, fetchMainPage } from "src/store/slices/mainPage/slice"
import { useNavigate } from "react-router-dom"
import MainImg from "src/assets/main-card.jpg"
import { useBreakpoints } from "src/core/hooks"
import MagicBook from "src/assets/magic-book.png"
import LeftEye from "src/assets/left-eye.png"
import RightEye from "src/assets/right-eye.png"
import Book from "src/assets/book.png"

export const Main = () => {
  const dispatch = useDispatch()

  const { table, tablet, phone } = useBreakpoints()

  const navigate = useNavigate()

  const { data, isLoading } = useSelector((state) => state.mainPage.mainData)

  useEffect(() => {
    dispatch(fetchCandels())
    dispatch(fetchMainPage())
  }, [])

  return (
    <>
      <Container>
        <Box padding="24px 0 40px" gap={table ? "56px" : "20px"} width="100%" wrap="wrap">
          {(table || tablet) && (
            <Box width={table ? "40%" : "50%"} borderRadius="20px" overflow="hidden">
              <img width="100%" src={MainImg} />
            </Box>
          )}

          <Box width={table ? "calc(60% - 56px)" : tablet ? "calc(50% - 20px)" : '100%'} direction="column" height="100%">
            {(table || tablet) && (
              <Box
                marginBottom="24px"
                width="100%"
                maxWidth="300px"
                marginTop="auto"
              >
                <Button width="100%" onClick={() => navigate(PAGES.catalog)}>
                  Каталог
                </Button>
              </Box>
            )}

            <Box
              fontSize={table ? "52px" : tablet ? "42px" : "32px"}
              marginBottom="32px"
              fontWeight="700"
            >
              МАГИЯ ЖИВЕТ <br /> В КАЖДОМ ИЗ НАС
            </Box>

            <Box fontSize="22px">
              Вопрос в том, готовы ли вы ее пробудить?
            </Box>

            {phone && (
              <Box
                marginBottom="24px"
                width="100%"
                marginTop="32px"
                marginRight="auto"
                marginLeft="auto"
              >
                <Button width="100%" onClick={() => navigate(PAGES.catalog)}>
                  Каталог
                </Button>
              </Box>
            )}

            {table && (
              <Box width="100%" gap="12px" marginTop="auto">
                <Box
                  padding="8px"
                  width="calc(33% - 8px)"
                  background="#000"
                  borderRadius="40px"
                  align="center"
                >
                  <Box marginRight="5px">🔮</Box>

                  <Box flexGrow={1}>Авторские изделия заряженные энергией</Box>
                </Box>

                <Box
                  padding="8px"
                  width="calc(33% - 8px)"
                  background="#000"
                  borderRadius="40px"
                  align="center"
                >
                  <Box marginRight="5px">🌙</Box>

                  <Box flexGrow={1}>Традиционные рецепты и обряды</Box>
                </Box>

                <Box
                  padding="8px"
                  width="calc(33% - 8px)"
                  background="#000"
                  borderRadius="40px"
                  align="center"
                >
                  <Box marginRight="5px">🕯️</Box>

                  <Box flexGrow={1}>Ручная работа и натуральные материалы</Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {tablet && (
            <Box width="100%" gap="12px" marginBottom="24px">
              <Box
                padding="8px"
                width="calc(33% - 8px)"
                background="#000"
                borderRadius="40px"
                align="center"
              >
                <Box marginRight="5px">🔮</Box>

                <Box flexGrow={1}>Авторские изделия заряженные энергией</Box>
              </Box>

              <Box
                padding="8px"
                width="calc(33% - 8px)"
                background="#000"
                borderRadius="40px"
                align="center"
              >
                <Box marginRight="5px">🌙</Box>

                <Box flexGrow={1}>Традиционные рецепты и обряды</Box>
              </Box>

              <Box
                padding="8px"
                width="calc(33% - 8px)"
                background="#000"
                borderRadius="40px"
                align="center"
              >
                <Box marginRight="5px">🕯️</Box>

                <Box flexGrow={1}>Ручная работа и натуральные материалы</Box>
              </Box>
            </Box>
          )}
      </Container>

      <Box padding={`${phone ? '20px' : '40px'} 0`} background="#fff">
        <Container>
          <Box gap="32px" direction={phone ? 'column' : 'row'} align="center">
            <Box maxWidth="130px">
              <img width="100%" src={MagicBook} />
            </Box>

            <Box direction="column" gap="32px">
              <Box color="#000" fontSize="18px" fontWeight="600">
                Наши свечи, зелья и артефакты созданы для тех, кто чувствует зов
                древних знаний. Каждое изделие – это энергия, сила и тайна,
                воплощенные в материальном мире.
              </Box>

              <Box color="#000" fontSize="18px" fontWeight="600">
                Выбирайте осознанно. Действуйте смело.
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container>
        {data?.categories
        ?.filter(({ products }) => Boolean(products?.length))
        .map(({ products, description, name, icon }) => (
          <Box padding="48px 0" direction="column" width="100%">
            <Box
              maxWidth="800px"
              width="100%"
              fontWeight="600"
              fontSize="24px"
              marginBottom="8px"
              justify="center"
              margin="0 auto"
            >
              <img src={icon} />&nbsp;{name}
            </Box>

            <Box
              maxWidth="800px"
              width="100%"
              fontWeight="400"
              fontSize="14px"
              opacity="0.5"
              justify="center"
              margin="0 auto"
            >
              {description}
            </Box>

            <Box gap="15px" marginTop="40px" wrap="wrap">
              {products.map((item) => (
                <Box width={table ? "calc(25% - 11px)" : tablet ? 'calc(33.33333% - 10px)' : 'calc(50% - 8px)'}>
                  <Card {...item} />
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Container>

      <Box padding={phone ? "36px 16px 28px" : "56px 36px 48px"} width="100%" background="#fff" >
        <Box width="100%" maxWidth="1100px" margin="0 auto" direction="column">
          <Box
            color="#000"
            fontSize={table ? "70px" : tablet ? "50px" : "30px"}
            fontWeight="800"
            width="100%"
            justify="center"
            textAlign="center"
          >
            {data?.about?.title}
          </Box>
          <Box
            width="100%"
            color="#000"
            fontSize={phone ? "20px" : "24px"}
            fontWeight="400"
            margin={phone ? "20px 0" : "40px 0"}
            textAlign="center"
          >
            {data?.about?.description}
          </Box>

          <Box
            width="100%"
            color="#000"
            fontSize="24px"
            fontWeight="800"
            margin={phone ? "20px auto" : "40px auto"}
            justify="center"
          >
            {data?.about?.trust?.title}
          </Box>

          <Box width="100%" maxWidth="700px" gap="12px" margin="0 auto" wrap="wrap">
            {data?.about?.trust?.items.map(({ image, title }) => (
              <Box width={phone ? "calc(50% - 6px)" : "calc(33.3333% - 8px)"} direction="column">
                <Box maxWidth="70px">
                  <img width="100%" src={image} />
                </Box>

                <Box
                  color="#000"
                  fontSize="16px"
                  fontWeight="600"
                  marginTop="16px"
                >
                  {title}
                </Box>
              </Box>
            ))}
          </Box>

          <Box
            width="100%"
            color="#000"
            fontSize="24px"
            fontWeight="800"
            margin={phone ? "40px auto 20px" : "80px auto 40px"}
            justify="center"
          >
            {data?.about?.motto}
          </Box>

          <Box gap="12px">
            <Box
              width="50%"
              border="1px solid transparent"
              borderRadiusTL="5px"
              borderRadiusBL="5px"
              overflow="hidden"
            >
              <img width="100%" src={LeftEye} />
            </Box>

            <Box
              width="50%"
              border="1px solid transparent"
              borderRadiusTR="5px"
              borderRadiusBR="5px"
              overflow="hidden"
            >
              <img width="100%" src={RightEye} />
            </Box>
          </Box>

          <Box
            width="100%"
            color="#000"
            fontSize="24px"
            fontWeight="800"
            margin={phone ? "36px auto 22px" : "56px auto 32px"}
            justify="center"
            textAlign="center"
          >
            {data?.about?.stats?.title}
          </Box>

          <Box gap={phone ? '12px' : "24px"} wrap="wrap">
            {data?.about?.stats?.items?.map(({ value, label, text }) => (
              <Box
                width={phone ? "calc(50% - 6px)" : "calc(33.3333% - 16px)"}
                direction="column"
                background="#FAFAFC"
                borderRadius="20px"
                padding="24px 16px"
              >
                <Box color={COLORS.main} fontSize="24px" fontWeight="800">
                  {value}
                </Box>

                <Box
                  color="#000"
                  fontSize="14px"
                  fontWeight="600"
                  margin="16px 0px 8px"
                >
                  {label}
                </Box>

                <Box color="#1E1E1E" fontSize="12px" fontWeight="400">
                  {text}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}
