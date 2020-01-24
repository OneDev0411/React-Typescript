import { SORTING__SET_ACTIVE_SORT } from '../../../constants'
import { ActiveSort } from '../../../../types'

export function setActiveSort(activeSort: ActiveSort) {
  return {
    type: SORTING__SET_ACTIVE_SORT,
    activeSort
  }
}
