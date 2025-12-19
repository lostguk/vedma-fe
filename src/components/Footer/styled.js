import styled from "@emotion/styled"

export const StyledFooter = styled.footer`
  padding: 36px 0;
`

export const FooterItem = styled.div`
  padding: 16px;
  background: #181e39;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  color: white;
  font-size: 14px;

  &:hover {
    background: #232b4d;
  }
`


export const StyledContacts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  & > h2 {
    font-size: 12px;
    font-weight: 600;
    margin: 0;
    padding: 0;
  }

  & > p {
    font-size: 12px;
    font-weight: 400;
    margin: 0;
    padding: 0;
  }
`
