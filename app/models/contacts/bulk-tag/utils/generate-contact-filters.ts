// import removeSpecialCharacters from '../../../utils/remove-special-characters'
import { Filters } from '../index'

export interface ContactFilterGenerator {
  selectedIds?: UUID[]
  excludes?: UUID[]
  users?: UUID[]
  searchText?: string
  crm_tasks?: UUID[]
  flows?: UUID[]
  conditionOperator?: TContactFilterType
  attributes: IContactAttributeFilter[]
  parked?: boolean | undefined
}

const isValidArrayFilter = (filter: any[]) => Array.isArray(filter) && filter.length > 0

const normalizeAttributeFilters = (filters: IContactAttributeFilter[]) => {
  return filters
    .filter(({ attribute_def }) => attribute_def)
    .map(({ attribute_def, invert, operator, value }) => ({
      attribute_def,
      invert,
      operator,
      value
    }))
}

export const generateContactFilters = ({
  selectedIds = [],
  users = [],
  searchText = '',
  conditionOperator = 'and',
  attributes = [],
  excludes = [],
  crm_tasks = [],
  flows = [],
  parked = undefined
}: ContactFilterGenerator): Filters => {
  const payload: Filters = {}

  if (selectedIds.length > 0) {
    payload.ids = selectedIds

    return payload
  }
  if (isValidArrayFilter(flows)) {
    payload.flows = flows
  }

  if (isValidArrayFilter(crm_tasks)) {
    payload.crm_tasks = crm_tasks
  }

  if (isValidArrayFilter(users)) {
    payload.users = users
  }

  if (isValidArrayFilter(excludes)) {
    payload.excludes = excludes
  }

  if (isValidArrayFilter(attributes)) {
    payload.attributes = normalizeAttributeFilters(attributes)
  }

  // we're doing this because we want to check parked field is exist or not
  if (typeof parked !== 'undefined' && searchText === '') {
    payload.parked = parked
  }

  payload.filter_type = conditionOperator

  return payload
}
