import { FilterLable, FilterShape } from './type'

// available filters
export const AVAILABLE_FILTERS: FilterLable[] = [
  {
    name: 'celebrationEvents',
    lable: 'Celebrations'
  },
  {
    name: 'dealEvents',
    lable: 'Deal’s Event'
  }
]

// initial filters
export const INITIAL_FILTERS: FilterShape = {
  celebrationEvents: true,
  dealEvents: true
}
