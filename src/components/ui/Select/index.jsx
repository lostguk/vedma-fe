import React from "react"
import Select from "react-select"
import { Box } from "src/components"

import styled from "@emotion/styled"

const StyledSelect = styled(Select)`
  width: 100%;

  & .prefix__indicator-separator {
    display: none;
  }

  & .prefix__menu-list {
    background: #f5f5f5;
    color: ${({ color = "#000" }) => color};
  }

  & .prefix__control {
    width: ${({ width }) => width || "100%"};
    padding: 0 24px;
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
  }
`
export const SelectUI = ({ options, onChange, value, placeholder }) => (
  <Box width="100%">
    <StyledSelect
      placeholder={placeholder}
      className="control"
      classNamePrefix="prefix"
      value={value}
      onChange={onChange}
      options={options}
    />
  </Box>
)
