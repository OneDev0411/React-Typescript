// import removeSpecialCharacters from '../../../utils/remove-special-characters'
import { Filters } from '../index'

export interface ContactFilterGenerator {
  selectedIds?: UUID[]
  excludes?: UUID[]
  users?: UUID[]
  searchText?: string
  crm_tasks?: UUID[]
  flows?: UUID[]
  conditionOperator?: string
}

export const generateContactFilters = ({
  selectedIds = [],
  users = [],
  searchText = '',
  conditionOperator = 'and',
  // filters = [],
  excludes = []
}: ContactFilterGenerator): Filters => {
  const filters: Filters = {}

  if (selectedIds.length > 0) {
    filters.ids = selectedIds

    return filters
  }

  return filters
}
