// import removeSpecialCharacters from '../../../utils/remove-special-characters'
import { Filters } from '../index'

export const generateFilters = ({
  ids = [],
  users = [],
  q = '',
  conditionOperator = 'and',
  // filters = [],
  excludes = []
}): Filters => {
  const filters: any = {}

  if (ids.length > 0) {
    filters.ids = ids
  }

  return filters
}
