import React, { useEffect } from "react"
import { Catalog, Container, Box, Card, Icon, Pagination, Button } from "src/components"
import { fetchProducts, setPage } from "src/store/slices/products/slice"
import { toggleCatalogSidePage } from "src/store/slices/global/slice"
import { useDispatch, useSelector } from "react-redux"
import { useBreakpoints } from "src/core/hooks"

import { ICON_NAMES } from "src/core/constants"

export const CatalogPage = () => {
  const dispatch = useDispatch()

  const { table, tablet, phone } = useBreakpoints()

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
    dispatch(fetchProducts({ page, per_page, category: undefined, search }))
  }, [page, search])
  
  const toggleCatalog = () => dispatch(toggleCatalogSidePage())

  return (
    <Container>
      <Box width="100%" align="flex-start">
        {table && (
          <Box width="25%" position="sticky" top="133px">
            <Catalog />
          </Box>
        )}

        <Box width={table ? "75%" : "100%"} direction="column"  position="relative" paddingTop={table ? '0' : '72px'}>
          <Box position={table ? 'static' : 'fixed'} top="137px" left='0' right="16px" zIndex="10"background="#0A0D1B">
            {(tablet || phone) && (
              <Box position="absolute" top="10px" left="15px">
                <Button variant="secondary" onClick={toggleCatalog}>
                  <Icon name={ICON_NAMES.catalog} />
                </Button>
              </Box>
            )}

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

          <Box wrap="wrap" gap="16px">

            {isLoading ? (
              <Box width="100px" height="80vh" margin="0 auto">
                <Icon name={ICON_NAMES.loader} />
              </Box>
            ) : (
              items.map((product) => (
                <Box width={phone ? "calc(50% - 8px)" : "calc(33.3333% - 12px)"} key={product.id}>
                  <Card {...product} />
                </Box>
              ))
            )}
          </Box>

          {table && (
            <Pagination
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={Math.ceil(total / per_page)}
              previousLabel="<"
              renderOnZeroPageCount={null}
            />
          )}
        </Box>
      </Box>
    </Container>
  )
}
