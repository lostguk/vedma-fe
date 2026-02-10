import styled from "@emotion/styled"
import { COLORS } from "src/core/constants"

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
  position: relative;
  background: ${({ active }) => (active ? "#181e39" : "white")};
  color: ${({ active }) => (active ? "white" : "#181e39")};

  &:hover {
    background: #181e39;
    color: white;
  }
`

export const MessageCount = styled.div`
  width: 22px;
  height: 22px;
  position: absolute;
  top: ${({ top }) => top};
  right: ${({ right }) => right};
  background: ${COLORS.main};
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 12px;
  padding-right: 1px;
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
