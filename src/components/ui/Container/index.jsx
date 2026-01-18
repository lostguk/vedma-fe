import { useBreakpoints } from "src/core/hooks"
import { Box } from "../Box"

export const Container = ({ children, background = "initial" }) => {

  const { table, tablet, phone } = useBreakpoints()

  return (
  <Box
    maxWidth="1360px"
    width="100%"
    padding={table ? "0 36px" : tablet ? "0 26px" : "0 16px"}
    margin="0 auto"
    wrap="wrap"
    background={background}
  >
    {children}
  </Box>
)
}
