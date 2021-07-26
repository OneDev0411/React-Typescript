import { ActiveSort } from '../../../../types'
import { SORTING__SET_ACTIVE_SORT } from '../../../constants'

export function setActiveSort(activeSort: ActiveSort) {
  return {
    type: SORTING__SET_ACTIVE_SORT,
    activeSort
  }
}
