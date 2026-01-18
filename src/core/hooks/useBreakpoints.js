import { useMediaQuery } from 'react-responsive'

export const useBreakpoints = () => {
  const table = useMediaQuery({ minWidth: 1200 })
  const tablet = useMediaQuery({ maxWidth: 1199, minWidth: 768 })
  const phone = useMediaQuery({ maxWidth: 767 })

  return {
    table,
    tablet,
    phone,
  }
}