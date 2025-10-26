import React, { useState, useEffect, useMemo } from "react"
import { Box, Icon } from "src/components"
import { fetchCategories } from "src/store/slices/categories/slice"
import {
  setFilter,
  setCatalogMenu,
  setCatalogMenuLevel,
} from "src/store/slices/products/slice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, generatePath } from "react-router-dom"
import { CatalogBody, CategoriesBody, Category, CategoriesItem } from "./styled"
import { ICON_NAMES, PAGES } from "src/core/constants"

export const Catalog = () => {
  const navigate = useNavigate()

  const menu = useSelector((state) => state.categories.items)

  const { slugs, slug: currentSlug } = useSelector(
    (state) => state.products.filter,
  )

  const { catalogMenuLevel, catalogMenu } = useSelector(
    (state) => state.products,
  )

  const dispatch = useDispatch()

  const onCategoryClick = ({ menu, level, slug }) => {
    dispatch(setFilter({ slug }))

    if (menu?.length) {
      dispatch(setFilter({ slugs: [...slugs, slug] }))

      dispatch(setCatalogMenuLevel(level))

      const proxy = [...catalogMenu]

      proxy[level] = menu

      dispatch(setCatalogMenu(proxy))
    }

    navigate(generatePath(PAGES.category, { slug }))
  }

  const LevelDown = (level) => {
    dispatch(setCatalogMenuLevel(level))

    dispatch(setCatalogMenu(catalogMenu.slice(0, catalogMenu.length - 1)))

    const proxySlugs = slugs.slice(0, slugs.length - 1)

    dispatch(
      setFilter({
        slugs: proxySlugs,
        slug: proxySlugs[proxySlugs.length - 1],
      }),
    )

    if (level) {
      navigate(
        generatePath(PAGES.category, {
          slug: proxySlugs[proxySlugs.length - 1],
        }),
      )
    } else {
      navigate(PAGES.catalog)
    }
  }

  useEffect(() => {
    dispatch(fetchCategories())
  }, [])

  useEffect(() => {
    if (!catalogMenu.length && menu.length) {
      dispatch(setCatalogMenu([menu]))
    }
  }, [menu])

  return (
    <CatalogBody>
      <CategoriesBody level={catalogMenuLevel}>
        {catalogMenu.map((item, i) => (
          <CategoriesItem key={i}>
            {catalogMenuLevel > 0 && (
              <Category onClick={() => LevelDown(catalogMenuLevel - 1)}>
                Назад
              </Category>
            )}

            {item.map(({ name, children, slug }) => (
              <Category
                key={slug}
                isActive={currentSlug === slug}
                onClick={() =>
                  onCategoryClick({
                    menu: children,
                    level: catalogMenuLevel + 1,
                    slug,
                  })
                }
              >
                {name}&nbsp;
                {Boolean(children?.length) && (
                  <Icon name={ICON_NAMES.arrowRight} />
                )}
              </Category>
            ))}
          </CategoriesItem>
        ))}
      </CategoriesBody>
    </CatalogBody>
  )
}
