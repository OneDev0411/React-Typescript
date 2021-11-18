import {
  DEALS_LIST_DEFAULT_FILTERS,
  DEALS_LIST_DEFUALT_ORDER
} from '../../constants'
import { DealsListPayload, SearchQuery } from '../../types'

/**
 * returns query param of static filters
 * @param searchQuery
 */
export function getStaticFilterQuery(
  searchQuery: SearchQuery
): DealsListPayload | {} {
  if (searchQuery.filter === 'listing') {
    return {
      query: searchQuery.term,
      ...DEALS_LIST_DEFAULT_FILTERS,
      deal_type: ['Selling'],
      $order: DEALS_LIST_DEFUALT_ORDER
    }
  }

  if (searchQuery.filter === 'contract') {
    return {
      query: searchQuery.term,
      ...DEALS_LIST_DEFAULT_FILTERS,
      deal_type: ['Buying'],
      $order: DEALS_LIST_DEFUALT_ORDER
    }
  }

  if (searchQuery.filter === 'all') {
    return {
      query: searchQuery.term,
      ...DEALS_LIST_DEFAULT_FILTERS,
      $order: DEALS_LIST_DEFUALT_ORDER
    }
  }

  return {}
}
