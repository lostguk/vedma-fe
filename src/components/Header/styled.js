import styled from "@emotion/styled"
import MaskedInput from "react-text-mask"

export const StyledHeader = styled.header`
  padding: 24px 0;
`

export const MaskInput = styled(MaskedInput)`
  width: ${({ width }) => width || "auto"};
  max-width: ${({ maxWidth }) => maxWidth || "100%"}!important;
  padding: 16px 24px;
  border-radius: 50px;
  color: ${({ color = "#000" }) => color};
  background: #f5f5f5;
  outline: none;
  border: 1px solid ${({ error }) => (error ? "red" : "transparent")};
`
