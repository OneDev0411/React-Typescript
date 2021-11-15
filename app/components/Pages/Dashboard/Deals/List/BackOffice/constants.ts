import { DealsListFilters, DealsOrder } from './types'

export const CHANGE_FILTERS_DEBOUNCE_MS = 300
export const QUERY_ARRAY_PARAM_SPLITTER_CHAR = ','

export const DEAL_TYPES: IDealType[] = ['Selling', 'Buying']

export const DEALS_LIST_DEFAULT_FILTERS: DealsListFilters = {
  deal_type: ['Selling'],
  status: {
    is_archived: false,
    is_null: true
  }
}

export const DEALS_LIST_DEFUALT_ORDER: DealsOrder = ['deals.created_at', 'DESC']
