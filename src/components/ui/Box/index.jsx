import styled from "@emotion/styled"

export const Box = styled.div`
  color: ${({ color = "inherit" }) => color};
  line-height: ${({ lineHeight = "inherit" }) => lineHeight};
  font-size: ${({ fontSize = "inherit" }) => fontSize};
  font-weight: ${({ fontWeight = "inherit" }) => fontWeight};
  display: ${({ display = "flex" }) => display};
  visibility: ${({ visibility }) => visibility};
  flex-direction: ${({ direction = "row" }) => direction};
  width: ${({ width = "auto" }) => width};
  max-width: ${({ maxWidth }) => maxWidth};
  min-width: ${({ minWidth }) => minWidth};
  height: ${({ height = "auto" }) => height};
  min-height: ${({ minHeight }) => minHeight};
  max-height: ${({ maxHeight }) => maxHeight};
  margin: ${({ margin = 0 }) => margin};
  margin-top: ${({ marginTop = "none" }) => marginTop};
  margin-bottom: ${({ marginBottom = "none" }) => marginBottom};
  margin-left: ${({ marginLeft = "none" }) => marginLeft};
  margin-right: ${({ marginRight = "none" }) => marginRight};
  padding: ${({ padding = 0 }) => padding};
  padding-top: ${({ paddingTop = "none" }) => paddingTop};
  padding-bottom: ${({ paddingBottom = "none" }) => paddingBottom};
  padding-left: ${({ paddingLeft = "none" }) => paddingLeft};
  padding-right: ${({ paddingRight = "none" }) => paddingRight};
  gap: ${({ gap = 0 }) => gap};
  row-gap: ${({ rowGap = 0 }) => rowGap};
  background: ${({ background = "none" }) => background};
  justify-content: ${({ justify = "normal" }) => justify};
  align-items: ${({ align = "normal" }) => align};
  border: ${({ border = "none" }) => border};
  border-top: ${({ borderTop = "none" }) => borderTop};
  border-bottom: ${({ borderBottom = "none" }) => borderBottom};
  border-left: ${({ borderleft = "none" }) => borderleft};
  border-right: ${({ borderRight = "none" }) => borderRight};
  border-radius: ${({ borderRadius = "none" }) => borderRadius};
  border-top-left-radius: ${({ borderRadiusTL = "none" }) => borderRadiusTL};
  border-bottom-left-radius: ${({ borderRadiusBL = "none" }) => borderRadiusBL};
  border-top-right-radius: ${({ borderRadiusTR = "none" }) => borderRadiusTR};
  border-bottom-right-radius: ${({ borderRadiusTL = "none" }) =>
    borderRadiusTL};
  border-width: ${({ borderWidth }) => borderWidth};
  flex-wrap: ${({ wrap = "nowrap" }) => wrap};
  flex-grow: ${({ flexGrow = 0 }) => flexGrow};
  flex-shrink: ${({ flexShrink = 1 }) => flexShrink};
  overflow: ${({ overflow = "visible" }) => overflow};
  cursor: ${({ cursor = "inherit" }) => cursor};
  position: ${({ position = "static" }) => position};
  top: ${({ top }) => top};
  right: ${({ right }) => right};
  bottom: ${({ bottom }) => bottom};
  left: ${({ left }) => left};
  text-align: ${({ textAlign = "start" }) => textAlign};
  text-decoration: ${({ textDecoration = "none" }) => textDecoration};
  opacity: ${({ opacity = 1 }) => opacity};
  grid-column: ${({ gridColumn = "auto" }) => gridColumn};
  grid-row: ${({ gridRow = "auto" }) => gridRow};
  grid-template-columns: ${({ gridColumns }) => gridColumns};
  grid-auto-rows: ${({ gridAutoRows }) => gridAutoRows};
  white-space: ${({ whiteSpace }) => whiteSpace};
  pointer-events: ${({ pointerEvents }) => pointerEvents};
  transform: ${({ transform }) => transform};
  rotate: ${({ rotate }) => rotate && `rotate(${rotate}deg)`};
  user-select: ${({ userSelect }) => userSelect};
  box-shadow: ${({ boxShadow }) => boxShadow};
  word-break: ${({ wordBreak }) => wordBreak};
  transition: ${({ transition }) => transition};
  align-self: ${({ alignSelf }) => alignSelf};
  z-index: ${({ zIndex }) => zIndex};

  &:hover {
    color: ${({ hoverStyles }) => hoverStyles?.color || ""};
    background: ${({ hoverStyles }) => hoverStyles?.background || ""};
    border: ${({ hoverStyles }) => hoverStyles?.border || ""};
    box-shadow: ${({ hoverStyles }) => hoverStyles?.boxShadow || ""};
    transform: ${({ hoverStyles }) => hoverStyles?.transform || ""};
    opacity: ${({ hoverStyles }) => hoverStyles?.opacity || ""};
    cursor: ${({ hoverStyles }) => hoverStyles?.cursor || ""};
    ${({ hoverStyles }) =>
      hoverStyles &&
      Object.entries(hoverStyles)
        .filter(
          ([key]) =>
            ![
              "color",
              "background",
              "border",
              "boxShadow",
              "transform",
              "opacity",
              "cursor",
            ].includes(key),
        )
        .map(([key, value]) => `${key}: ${value};`)
        .join("")}
  }
`
