import { DealsListFilters, DealsOrder } from './types'

export const CHANGE_FILTERS_DEBOUNCE_MS = 700
export const SEARCH_INPUT_DEBOUNCE_MS = 700

export const DEAL_TYPES: IDealType[] = ['Selling', 'Buying']

export const DATE_FORMAT = 'MM-dd-yyyy'

export const DEALS_STATUSES = {
  is_active: 'Active',
  is_closed: 'Closed',
  is_pending: 'Pending',
  is_archived: 'Archived',
  is_null: 'No status'
} as const

export const DEALS_LIST_DEFAULT_FILTERS: DealsListFilters = {
  deal_type: ['Buying', 'Selling'],
  property_type: [],
  status: {},
  contexts: {}
}

export const DEALS_LIST_DEFUALT_ORDER: DealsOrder = ['deals.created_at', 'DESC']
