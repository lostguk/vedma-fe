import styled from "@emotion/styled"

export const TabMenuItem = styled.div`
  display: flex;
  padding: 12px 16px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 900;
  transition: all 0.3s;
  cursor: pointer;
  border-radius: 30px;
  background: ${({ active }) => (active ? "#181e39" : "white")};
  color: ${({ active }) => (active ? "white" : "#181e39")};

  &:hover {
    background: #181e39;
    color: white;
  }
`
