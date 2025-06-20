import React from "react-paginate"

import { Box } from "src/components"

import styled from "@emotion/styled"

export const RadioWrapper = styled.label`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid ${({ color }) => color || "black"};
  cursor: pointer;
  position: relative;

  & input:checked + div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;

    & span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ff0000;
    }
  }
`
export const Radio = ({ name, value, onChange, checked, label, color }) => (
  <Box align="center">
    <Box marginRight="16px" color={color || "initial"}>
      {label}
    </Box>

    <RadioWrapper color={color}>
      <input
        name={name}
        onChange={onChange}
        value={value}
        type="radio"
        checked={checked}
        hidden
      />
      <div>
        <span />
      </div>
    </RadioWrapper>
  </Box>
)
