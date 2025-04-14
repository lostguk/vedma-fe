import { NavLink } from "react-router-dom"

import styled from "@emotion/styled"

const Styled = styled(NavLink)`
  text-decoration: none;
  color: inherit;
  outline: none;

  &.active {
    color: ${({ activeColor }) => activeColor};
    pointer-events: ${({ disabled }) => (disabled ? "none" : "initial")};
  }
`

export const Link = ({ to, children, activeColor, disabled = false }) => (
  <Styled to={to} activeColor={activeColor} disabled={disabled}>
    {children}
  </Styled>
)
