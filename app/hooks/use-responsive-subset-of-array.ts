import { useBreakpoint } from 'hooks/use-breakpoint'

interface BreakpointSubsetCount {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

export function useResponsiveSubsetOfArray<T>(
  items: T[],
  breakpoints: BreakpointSubsetCount
): T[] {
  const breakpoint = useBreakpoint()

  const subsetLength = breakpoints[breakpoint] ?? items.length

  return items.slice(0, subsetLength)
}
