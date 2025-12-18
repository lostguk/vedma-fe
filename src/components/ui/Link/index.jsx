import { NavLink } from "react-router-dom"
import { COLORS } from "src/core/constants"

import styled from "@emotion/styled"

const Styled = styled(NavLink)`
  text-decoration: none;
  color: inherit;
  outline: none;
  transition: all 0.3s;

  &.active {
    color: ${({ activeColor }) => activeColor};
    pointer-events: ${({ disabled }) => (disabled ? "none" : "initial")};
  }

  &:hover {
    color: ${COLORS.main};
  }
`

export const Link = ({ to, children, activeColor, disabled = false }) => (
  <Styled to={to} activeColor={activeColor} disabled={disabled}>
    {children}
  </Styled>
)
