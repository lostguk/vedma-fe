import styled from "@emotion/styled"

export const CartBody = styled.div`
  position: absolute;
  background: #fff;
  right: 20px;
  top: 10vh;
  width: 100%;
  max-width: 800px;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  z-index: 10;
  max-height: 80vh;
  overflow: auto;
`

export const ActionButton = styled.div`
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

  &:hover {
    opacity: 0.6;
  }
`
