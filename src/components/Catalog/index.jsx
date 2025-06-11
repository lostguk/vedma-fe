import React, { useState, useEffect } from "react"
import { Box, Icon } from "src/components"
import { fetchCategories } from "src/store/slices/categories/slice"
import { setFilter } from "src/store/slices/products/slice"
import { useDispatch, useSelector } from "react-redux"
import { CatalogBody, CategoriesBody, Category, CategoriesItem } from "./styled"
import { ICON_NAMES } from "src/core/constants"

export const Catalog = () => {
  const menu = useSelector((state) => state.categories.items)
  const { category } = useSelector((state) => state.products.filter)

  console.log(menu)

  const [currentMenu, setCurrentMenu] = useState([])

  const [currentLevel, setCurrentlevel] = useState(0)

  const dispatch = useDispatch()

  const onCategoryClick = ({ menu, level, slug }) => {
    if (!menu?.length) {
      dispatch(setFilter({ filter: "category", value: slug }))

      return null
    }

    setCurrentlevel(level)

    setCurrentMenu((prev) => {
      const proxy = [...prev]

      proxy[level] = menu

      return proxy
    })
  }

  const LevelDown = (level) => {
    setCurrentlevel(level)

    setCurrentMenu((prev) => {
      const proxy = [...prev]

      proxy[level + 1] = menu

      return proxy
    })
  }

  useEffect(() => {
    dispatch(fetchCategories())
  }, [])

  useEffect(() => {
    setCurrentMenu([menu])
  }, [menu])

  return (
    <CatalogBody>
      <CategoriesBody level={currentLevel}>
        {currentMenu.map((item, i) => (
          <CategoriesItem key={i}>
            {currentLevel > 0 && (
              <Category onClick={() => LevelDown(currentLevel - 1)}>
                Назад
              </Category>
            )}

            {item.map(({ name, children, slug }) => (
              <Category
                key={slug}
                isActive={category === slug}
                onClick={() =>
                  onCategoryClick({
                    menu: children,
                    level: currentLevel + 1,
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
