import styled from "@emotion/styled"
import MaskedInput from "react-text-mask"

export const StyledHeader = styled.header`
  padding: 24px 0;
`

export const PhoneInput = styled(MaskedInput)`
  width: ${({ width }) => width || "100%"};
  max-width: ${({ maxWidth }) => maxWidth || "100%"}!important;
  padding: 16px 24px;
  border-radius: 50px;
  color: ${({ color = "#000" }) => color};
  background: #f5f5f5;
  outline: none;
  border: 1px solid ${({ error }) => (error ? "red" : "transparent")};
  height: 50px;

  &:focus {
    border-color: #007cd6;
    box-shadow:
      inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 0 3px rgba(0, 124, 214, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`
