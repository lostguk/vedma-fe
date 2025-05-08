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
`

export const Input = (props) => {
  return (
    <Box direction="column" maxWidth="100%">
      <StyledInput {...props} />

      {props.error && (
        <Box marginTop="4px" paddingLeft="8px" color="red">
          {props.error}
        </Box>
      )}
    </Box>
  )
}
