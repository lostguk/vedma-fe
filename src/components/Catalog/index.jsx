import React, { useState, useEffect, useMemo } from "react"
import { Box, Icon } from "src/components"
import { useParams } from "react-router-dom"
import { fetchCategories } from "src/store/slices/categories/slice"
import { setFilter, setCatalogMenu } from "src/store/slices/products/slice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, generatePath } from "react-router-dom"
import { CatalogBody, CategoriesBody, Category, CategoriesItem } from "./styled"
import { ICON_NAMES, PAGES } from "src/core/constants"

const findCategoryById = (categories, id) => {
  for (const category of categories) {
    if (category.id === id) {
      return category
    }

    if (category.children && category.children.length > 0) {
      const found = findCategoryById(category.children, id)
      if (found) return found
    }
  }

  return null
}

const findCategoryBySlug = (categories, slug) => {
  for (const category of categories) {
    if (category.slug === slug) {
      return category
    }

    if (category.children && category.children.length > 0) {
      const found = findCategoryBySlug(category.children, slug)
      if (found) return found
    }
  }

  return null
}

export const Catalog = () => {
  const params = useParams()

  const navigate = useNavigate()

  const menu = useSelector((state) => state.categories.items)

  const { catalogMenu } = useSelector((state) => state.products)

  const dispatch = useDispatch()

  const onCategoryClick = ({ slug }) => {
    dispatch(setFilter({ slug }))

    navigate(generatePath(PAGES.category, { slug }))
  }

  const LevelDown = () => {
    const currentCategory = findCategoryBySlug(menu, params.slug)

    if (currentCategory.parent_id) {
      if (currentCategory.children?.length) {
        navigate(
          generatePath(PAGES.category, {
            slug: findCategoryById(menu, currentCategory.parent_id).slug,
          }),
        )
      } else {
        const parentCategorySlug = findCategoryById(
          menu,
          findCategoryById(menu, currentCategory.parent_id).parent_id,
        )?.slug

        if (parentCategorySlug) {
          navigate(
            generatePath(PAGES.category, {
              slug: parentCategorySlug,
            }),
          )
        } else {
          navigate(PAGES.catalog)
        }
      }
    } else {
      navigate(PAGES.catalog)
    }
  }

  useEffect(() => {
    dispatch(fetchCategories())
  }, [])

  useEffect(() => {
    if (menu.length) {
      if (params.slug) {
        const currentCategory = findCategoryBySlug(menu, params.slug)

        if (currentCategory.children?.length) {
          dispatch(setCatalogMenu(currentCategory.children))
        } else {
          dispatch(
            setCatalogMenu(
              findCategoryById(menu, currentCategory.parent_id).children,
            ),
          )
        }
      } else {
        dispatch(setCatalogMenu(menu))
      }
    }
  }, [menu, params.slug])

  return (
    <CatalogBody>
      <CategoriesBody>
        <CategoriesItem>
          {Boolean(params.slug) && (
            <Category onClick={LevelDown}>Назад</Category>
          )}

          {catalogMenu.map(({ name, slug, children }) => (
            <Category
              key={slug}
              isActive={params.slug === slug}
              onClick={() =>
                onCategoryClick({
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
      </CategoriesBody>
    </CatalogBody>
  )
}
