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
    hoverColor: "#ccc",
    backgroundColor: COLORS.secondary,
    backgroundHoverColor: "#2A334D",
    borderColor: COLORS.secondary,
    borderHoverColor: "white",
  },

  black: {
    color: "#fff",
    hoverColor: "#ccc",
    backgroundColor: "#232323",
    backgroundHoverColor: "#2A334D",
    borderColor: "#232323",
    borderHoverColor: "white",
  },
}

const sizes = {
  medium: {
    padding: "12px 14px",
    fontSize: "16px",
  },

  large: {
    padding: "16px 20px",
    fontSize: "18px",
  },
}

const Styled = styled.button`
  pointer-events: ${({ disabled }) => (disabled ? "none" : "initial")};
  width: ${({ width }) => width || "auto"};
  min-width: ${({ minWidth }) => minWidth || "40px"};
  max-width: ${({ maxWidth }) => maxWidth || "initial"};
  display: flex;
  border-radius: 50px;
  font-weight: 600;
  color: ${({ variant }) => variants[variant].color};
  background: ${({ variant }) => variants[variant].backgroundColor};
  transition: all 0.3s;
  border: 1px solid ${({ variant }) => variants[variant].borderColor};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? "0.7" : "1")};
  padding: ${({ size }) => sizes[size].padding};
  font-size: ${({ size }) => sizes[size].fontSize};

  &:hover {
    color: ${({ variant }) => variants[variant].hoverColor}!important;
    background: ${({ variant }) => variants[variant].backgroundHoverColor};
    border: 1px solid ${({ variant }) => variants[variant].backgroundHoverColor};
  }
`

export const Button = ({
  variant = "primary",
  size = "medium",
  children,
  ...props
}) => (
  <Styled variant={variant} size={size} {...props}>
    {children}
  </Styled>
)
