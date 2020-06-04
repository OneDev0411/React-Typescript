import { Filter } from './Filters/types'

export const DEFAULT_RADIUS_FILTER: Required<Omit<Filter, 'areas'>> = {
  type: 'radius',
  radius: 3
}
