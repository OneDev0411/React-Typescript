import { useMediaQuery, useTheme } from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'

function useIsMobile(breakpoint: Breakpoint = 'sm'): boolean {
  const theme = useTheme()

  return !!useMediaQuery(theme.breakpoints.down(breakpoint))
}

export default useIsMobile
