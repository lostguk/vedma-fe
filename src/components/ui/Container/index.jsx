import React from "react"
import { Box } from "../Box"

export const Container = ({ children, background = "initial" }) => (
  <Box
    maxWidth="1360px"
    width="100%"
    padding="0 36px"
    margin="0 auto"
    wrap="wrap"
    background={background}
  >
    {children}
  </Box>
)
