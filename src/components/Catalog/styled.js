import styled from "@emotion/styled"
import { COLORS } from "src/core/constants"

export const CatalogBody = styled.div`
  padding: 16px 20px;
  display: flex;
  width: 270px;
  flex-direction: column;
  overflow-x: hidden;
  background: ${COLORS.secondary};
`

export const LinksBody = styled.div`
  display: flex;
  transition: all 0.2s;
  transform: ${({ level }) =>
    `translateX(calc(-${100 * level}% - ${20 * level}px))`};
`

export const LinkItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: calc(100% + 20px);
`
