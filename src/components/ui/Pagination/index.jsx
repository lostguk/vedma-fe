import styled from "@emotion/styled"
import ReactPaginate from "react-paginate"

export const Pagination = styled(ReactPaginate)`
  display: flex;
  width: 100%;
  list-style: none;
  align-items: flex-start;
  justify-content: center;

  & li {
    & > a {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      background: #181e39;
      margin: 0 4px;
      transition: all 0.3s;
      cursor: pointer;

      @media (max-width: 767px) {
        width: 30px;
        height: 30px;
      }
    }

    &.selected > a {
      background: #ff5100;
    }

    &:hover {
      opacity: 0.6;
    }

    &.break > a {
      background: none;
      align-items: flex-end;
      cursor: initial;
    }

    &.disabled > a {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`
