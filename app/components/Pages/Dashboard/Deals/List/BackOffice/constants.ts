import { DealsListFilters, DealsOrder } from './types'

export const CHANGE_FILTERS_DEBOUNCE_MS = 300
export const QUERY_ARRAY_PARAM_SPLITTER_CHAR = ','

export const DEAL_TYPES: IDealType[] = ['Selling', 'Buying']

export const DEALS_STATUSES = {
  is_active: 'Active',
  is_closed: 'Closed',
  is_pending: 'Pending',
  is_archived: 'Archived',
  is_null: 'Null Status'
} as const

export const DEALS_LIST_DEFAULT_FILTERS: DealsListFilters = {
  deal_type: ['Selling'],
  status: {
    is_active: true,
    is_closed: true,
    is_pending: true,
    is_archived: false,
    is_null: true
  }
}

export const DEALS_LIST_DEFUALT_ORDER: DealsOrder = ['deals.created_at', 'DESC']
