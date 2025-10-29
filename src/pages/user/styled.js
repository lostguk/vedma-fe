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

export const MediaButton = styled.div`
  width: auto;
  min-width: 40px;
  display: flex;
  border-radius: 50px;
  font-weight: 600;
  color: "#fff";
  background: #232323;
  transition: all 0.3s;
  border: 1px solid #232323;
  cursor: pointer;
  justify-content: center;
  padding: 12px 14px;
  font-size: 16px;

  &:hover {
    color: #ccc !important;
    background: #2a334d;
    border: 1px solid white;
  }
`
