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

export const CategoriesBody = styled.div`
  display: flex;
  transition: all 0.2s;
`

export const CategoriesItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 100%;
  margin-right: 20px;
`

export const Category = styled.div`
  display: flex;
  align-items: center;
  min-width: 100%;
  transition: all 0.3s;
  background: #0a0d1b;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  color: ${({ isActive }) => (isActive ? COLORS.main : "#fff")};

  &:hover {
    color: ${COLORS.main};
  }
`
