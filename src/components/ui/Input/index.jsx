import React from "react"
import styled from "@emotion/styled"
import { Box } from "src/components"

const StyledInput = styled.input`
  width: ${({ width }) => width || "auto"};
  padding: 16px 24px;
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
`

export const Input = (props) => {
  return (
    <Box direction="column" maxWidth="100%" width={props.width || "100%"}>
      <StyledInput {...props} />

      {props.error?.length && (
        <Box marginTop="4px" fontSize="12px" paddingLeft="8px" color="red">
          {props.error}
        </Box>
      )}
    </Box>
  )
}
