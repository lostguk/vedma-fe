import styled from "@emotion/styled"
import { COLORS } from "src/core/constants"

const variants = {
  primary: {
    color: "#fff",
    hoverColor: "#ccc",
    backgroundColor: COLORS.main,
    backgroundHoverColor: "#D94E00",
    borderColor: COLORS.main,
    borderHoverColor: "white",
  },
  secondary: {
    color: "#fff",
    hoverColor: "#333333",
    backgroundColor: COLORS.secondary,
    backgroundHoverColor: "#2A334D",
    borderColor: COLORS.secondary,
    borderHoverColor: "white",
  },
}

const Styled = styled.button`
  width: auto;
  min-width: 40px;
  display: flex;
  padding: 12px 14px;
  border-radius: 50px;
  font-weight: 600;
  color: ${({ variant }) => variants[variant].color};
  background: ${({ variant }) => variants[variant].backgroundColor};
  transition: all 0.3s;
  border: 1px solid ${({ variant }) => variants[variant].borderColor};
  cursor: pointer;

  &:hover {
    color: ${({ variant }) => variants[variant].hoverColor};
    background: ${({ variant }) => variants[variant].backgroundHoverColor};
    border: 1px solid ${({ variant }) => variants[variant].backgroundHoverColor};
  }
`

export const Button = ({ variant = "primary", children }) => (
  <Styled variant={variant}>{children}</Styled>
)
