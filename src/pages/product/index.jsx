import React, { useEffect } from "react"
import {
  Container,
  Box,
  ActionButton,
  Button,
  Card,
  Icon,
} from "src/components"
import { useDispatch, useSelector } from "react-redux"
import Slider from "react-slick"
import { useParams } from "react-router-dom"
import { fetchProduct } from "src/store/slices/products/slice"
import { ICON_NAMES } from "src/core/constants"
import {
  addCartItem,
  plusCartItem,
  minusCartItem,
} from "src/store/slices/global/slice"

export const Product = () => {
  const params = useParams()

  const dispatch = useDispatch()

  const { item: product, isProductLoading } = useSelector(
    (state) => state.products,
  )

  const cart = useSelector((state) => state.global.cart)

  const currentItem = cart.find(({ slug }) => slug === product?.slug)

  const plusItem = () => dispatch(plusCartItem(product.id))

  const minusItem = () => dispatch(minusCartItem(product.id))

  const addToCart = () => {
    dispatch(addCartItem(product))
  }

  useEffect(() => {
    dispatch(fetchProduct({ slug: params.slug }))
  }, [])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  }

  return (
    <Box padding="48px 0 72px">
      <Container>
        {isProductLoading ? (
          <Box width="100px" height="80vh" margin="0 auto">
            <Icon name={ICON_NAMES.loader} />
          </Box>
        ) : (
          <Box direction="column" width="100%">
            <Box
              fontSize="56px"
              color="white"
              fontWeight="900"
              paddingRight="48px"
              marginBottom="50px"
            >
              {product?.name}
            </Box>

            <Box width="100%">
              <Box width="50%">
                <img width="100%" src={product?.images_urls} />
              </Box>

              <Box
                width="50%"
                direction="column"
                padding=" 16px 16px 16px 32px"
              >
                <Box fontSize="18px" color="white" marginBottom="32px">
                  {product?.description}
                </Box>

                <Box width="100%" direction="column" align="center">
                  {currentItem ? (
                    <Box>
                      <Box onClick={minusItem}>
                        <ActionButton>-</ActionButton>
                      </Box>
                      <Box align="center" justify="center" margin="0 24px">
                        {currentItem.count}
                      </Box>
                      <Box onClick={plusItem}>
                        <ActionButton>+</ActionButton>
                      </Box>
                    </Box>
                  ) : (
                    <Button
                      width="100%"
                      maxWidth="200px"
                      variant="secondary"
                      onClick={addToCart}
                    >
                      В корзину
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>

            <Box
              fontSize="32px"
              color="white"
              fontWeight="600"
              marginBottom="24px"
              marginTop="24px"
              justify="center"
            >
              Похожие товары
            </Box>

            {Boolean(product?.related?.length) && (
              <div className="slider-container">
                <Slider {...settings}>
                  {[...product.related, ...product.related].map((product) => (
                    <Box height="100%" key={product.id} padding="0 8px">
                      <Card {...product} />
                    </Box>
                  ))}
                </Slider>
              </div>
            )}
          </Box>
        )}
      </Container>
    </Box>
  )
}
