import React, { useEffect } from "react"
import { Container, Button, Box, Card } from "src/components"
import { COLORS, PAGES } from "src/core/constants"
import { useDispatch, useSelector } from "react-redux"
import { fetchCandels } from "src/store/slices/mainPage/slice"
import { useNavigate } from "react-router-dom"

const Main = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const { items, isLoading } = useSelector((state) => state.mainPage.candels)

  const infoItems = [
    {
      img: "src/assets/book.png",
      desc: "Проверенные рецепты",
    },
    {
      img: "src/assets/book.png",
      desc: "Только натуральные материалы",
    },
    {
      img: "src/assets/book.png",
      desc: "Энергетическая зарядка каждого изделия",
    },
  ]

  const ourNumbers = [
    {
      title: "3600 +",
      subtitle: "Довольных клиентов",
      desc: "В нашем магазине каждый найдет инструмент для улучшения своей жизни",
    },
    {
      title: "6",
      subtitle: "Лет",
      desc: "Изготавливаем для людей волшебные свечи",
    },
    {
      title: "500 +",
      subtitle: "Моделей свечей",
      desc: "Используем только натуральный пчелиный воск, травы и эфирные масла",
    },
  ]

  useEffect(() => {
    dispatch(fetchCandels())
  }, [])

  return (
    <>
      <Container>
        <Box padding="24px 0 40px" gap="56px" width="100%">
          <Box width="40%" borderRadius="20px" overflow="hidden">
            <img width="100%" src="src/assets/main-card.jpg" />
          </Box>

          <Box width="60%" direction="column">
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

            <Box
              maxWidth="60%"
              fontSize="52px"
              lineHeight="52px"
              marginBottom="32px"
            >
              Магия живет в каждом из нас
            </Box>

            <Box maxWidth="60%" fontSize="22px">
              Вопрос в том, готовы ли вы ее пробудить?
            </Box>

            <Box width="100%" gap="12px" marginTop="80px">
              <Box
                padding="8px"
                width="calc(33% - 8px)"
                background="#000"
                borderRadius="40px"
                aling="center"
              >
                <Box marginRight="5px">🔮</Box>

                <Box flexGrow={1}>Авторские изделия заряженные энергией</Box>
              </Box>

              <Box
                padding="8px"
                width="calc(33% - 8px)"
                background="#000"
                borderRadius="40px"
                aling="center"
              >
                <Box marginRight="5px">🌙</Box>

                <Box flexGrow={1}>Традиционные рецепты и обряды</Box>
              </Box>

              <Box
                padding="8px"
                width="calc(33% - 8px)"
                background="#000"
                borderRadius="40px"
                aling="center"
              >
                <Box marginRight="5px">🕯️</Box>

                <Box flexGrow={1}>Ручная работа и натуральные материалы</Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      <Box padding="40px 0" background="#fff">
        <Container>
          <Box gap="32px">
            <Box maxWidth="130px">
              <img width="100%" src="src/assets/magic-book.png" />
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
            🕯️ Магические свечи
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
            Зажгите свечу, сосредоточьтесь на своем желании, наблюдайте за
            пламенем и отпустите намерение во Вселенную.
          </Box>

          <Box gap="15px" marginTop="40px">
            {items.map((item) => (
              <Box width="calc(33.3333% - 10px)">
                <Card {...item} />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>

      <Box padding="56px 0 48px" width="100%" background="#fff">
        <Box width="100%" maxWidth="1100px" margin="0 auto" direction="column">
          <Box
            color="#000"
            fontSize="70px"
            fontWeight="800"
            width="100%"
            justify="center"
            textAlign="center"
          >
            🔮 Наша магия – ваша сила
          </Box>
          <Box
            width="100%"
            color="#000"
            fontSize="24px"
            fontWeight="400"
            margin="40px 0"
            textAlign="center"
          >
            Мы верим в силу природы, традиционных знаний и искреннего намерения.
            Наши изделия создаются с соблюдением обрядов, а каждый талисман и
            свеча проходят ритуал зарядки.
          </Box>

          <Box
            width="100%"
            color="#000"
            fontSize="24px"
            fontWeight="800"
            margin="40px auto"
            justify="center"
          >
            🌙 Почему нам доверяют?
          </Box>

          <Box width="100%" maxWidth="700px" gap="12px" margin="0 auto">
            {infoItems.map(({ img, desc }) => (
              <Box width="calc(33.3333% - 8px)" direction="column">
                <Box maxWidth="70px">
                  <img width="100%" src={img} />
                </Box>

                <Box
                  color="#000"
                  fontSize="16px"
                  fontWeight="600"
                  marginTop="16px"
                >
                  {desc}
                </Box>
              </Box>
            ))}
          </Box>

          <Box
            width="100%"
            color="#000"
            fontSize="24px"
            fontWeight="800"
            margin="80px auto 40px"
            justify="center"
          >
            ✨ Магия в ваших руках – главное, использовать ее с осознанием.
          </Box>

          <Box gap="12px">
            <Box
              width="50%"
              border="1px solid transparent"
              borderRadiusTL="5px"
              borderRadiusBL="5px"
              overflow="hidden"
            >
              <img width="100%" src="src/assets/left-eye.png" />
            </Box>

            <Box
              width="50%"
              border="1px solid transparent"
              borderRadiusTR="5px"
              borderRadiusBR="5px"
              overflow="hidden"
            >
              <img width="100%" src="src/assets/right-eye.png" />
            </Box>
          </Box>

          <Box
            width="100%"
            color="#000"
            fontSize="24px"
            fontWeight="800"
            margin="56px auto 32px"
            justify="center"
            textAlign="center"
          >
            🧮 Мы в цифрах
          </Box>

          <Box gap="24px">
            {ourNumbers.map(({ title, subtitle, desc }) => (
              <Box
                width="calc(33.3333% - 16px)"
                direction="column"
                background="#FAFAFC"
                borderRadius="20px"
                padding="24px 16px"
              >
                <Box color={COLORS.main} fontSize="24px" fontWeight="800">
                  {title}
                </Box>

                <Box
                  color="#000"
                  fontSize="14px"
                  fontWeight="600"
                  margin="16px 0px 8px"
                >
                  {subtitle}
                </Box>

                <Box color="#1E1E1E" fontSize="12px" fontWeight="400">
                  {desc}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Main
