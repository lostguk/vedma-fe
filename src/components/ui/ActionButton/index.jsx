import styled from "@emotion/styled"
import { COLORS } from "src/core/constants"

export const Styled = styled.div`
  display: flex;
  width: 30px;
  height: 30px;
  padding: 8px;
  align-items: center;
  justify-content: center;
  color: #a5a5a5;
  border-radius: 5px;
  border: 1px solid #a5a5a5;
  transition: all 0.3s;
  cursor: pointer;

  @media (max-width: 767px) {
    width: 25px;
    height: 25px;
  }

  &:hover {
    &:hover {
      background: ${COLORS.main};
      color: white;
      border: 1px solid ${COLORS.main};
    }
  }
`

export const ActionButton = ({ children }) => <Styled>{children}</Styled>
