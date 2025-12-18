import React, { useEffect } from "react"
import { Catalog, Container, Box, Card, Icon, Pagination } from "src/components"
import { fetchProducts, setPage } from "src/store/slices/products/slice"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import { ICON_NAMES } from "src/core/constants"

export const CategoryPage = () => {
  const params = useParams()

  const dispatch = useDispatch()

  const {
    items,
    page,
    per_page,
    total,
    isLoading,
    filter: { search },
  } = useSelector((state) => state.products)

  const handlePageClick = ({ selected }) => dispatch(setPage(selected + 1))

  useEffect(() => {
    dispatch(
      fetchProducts({
        page,
        per_page,
        category: params.slug,
        search,
      }),
    )
  }, [page, params.slug, search])

  return (
    <Container>
      <Box width="100%" align="flex-start">
        <Box width="25%" position="sticky" top="133px">
          <Catalog />
        </Box>

        <Box width="75%" direction="column">
          <Pagination
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={Math.ceil(total / per_page)}
            previousLabel="<"
            renderOnZeroPageCount={null}
          />

          <Box wrap="wrap" gap="16px">
            {isLoading ? (
              <Box width="100px" height="80vh" margin="0 auto">
                <Icon name={ICON_NAMES.loader} />
              </Box>
            ) : (
              items.map((product) => (
                <Box width="calc(33.3333% - 12px)" key={product.id}>
                  <Card {...product} />
                </Box>
              ))
            )}
          </Box>
          
          <Pagination
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={Math.ceil(total / per_page)}
            previousLabel="<"
            renderOnZeroPageCount={null}
          />
        </Box>
      </Box>
    </Container>
  )
}
