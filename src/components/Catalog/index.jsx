import React, { useState, useEffect } from "react"
import { Box, Icon } from "src/components"
import { fetchCategories } from "src/store/slices/categories/slice"
import { useDispatch, useSelector } from "react-redux"
import { CatalogBody, LinksBody, LinkItem } from "./styled"
import { ICON_NAMES } from "src/core/constants"

export const Catalog = () => {
  const menu = useSelector((state) => state.categories.items)

  const [currentMenu, setCurrentMenu] = useState([])

  const [currentLevel, setCurrentlevel] = useState(0)

  const dispatch = useDispatch()

  const LevelUp = ({ menu, level }) => {
    if (!menu?.length) {
      alert("good")

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
      <LinksBody level={currentLevel}>
        {currentMenu.map((item, i) => (
          <LinkItem key={i}>
            {currentLevel > 0 && (
              <Box onClick={() => LevelDown(currentLevel - 1)}> Назад </Box>
            )}

            {item.map(({ name, children }) => (
              <Box
                maxWidth="calc(100% - 20px)"
                key={name}
                align="center"
                onClick={() =>
                  LevelUp({ menu: children, level: currentLevel + 1 })
                }
              >
                {name}&nbsp;
                {children?.length && <Icon name={ICON_NAMES.arrowRight} />}
              </Box>
            ))}
          </LinkItem>
        ))}
      </LinksBody>
    </CatalogBody>
  )
}
