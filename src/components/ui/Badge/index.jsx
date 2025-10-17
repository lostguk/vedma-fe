import styled from "@emotion/styled"

const StyledBadge = styled.div`
  border-radius: 50%;
  background: #ff5100;
  padding: 4px;
  color: white;
  font-size: 12px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Badge = ({ children }) => <StyledBadge>{children}</StyledBadge>
