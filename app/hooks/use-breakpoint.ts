import { useMediaQuery, useTheme } from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'

export function useBreakpoint(): Breakpoint {
  const theme = useTheme()

  const isXs = useMediaQuery(theme.breakpoints.down('xs'))
  const isSm = useMediaQuery(theme.breakpoints.between('xs', 'sm'))
  const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isLg = useMediaQuery(theme.breakpoints.between('md', 'lg'))

  if (isXs) {
    return 'xs'
  }

  if (isSm) {
    return 'sm'
  }

  if (isMd) {
    return 'md'
  }

  if (isLg) {
    return 'lg'
  }

  return 'xl'
}
