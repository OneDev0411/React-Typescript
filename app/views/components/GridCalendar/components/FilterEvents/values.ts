import { FilterLable, FilterShape } from './type'

// available filters
export const AVAILABLE_FILTERS: FilterLable[] = [
  {
    name: 'userEvents',
    lable: "User's Event"
  },
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
  userEvents: true,
  celebrationEvents: true,
  dealEvents: true
}
