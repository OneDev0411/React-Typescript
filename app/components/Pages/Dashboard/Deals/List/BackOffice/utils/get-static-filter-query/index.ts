import { SearchQuery } from '../../types'

/**
 * returns query param of static filters
 * @param user
 * @param searchQuery
 */
export function getStaticFilterQuery(searchQuery: SearchQuery): object {
  if (searchQuery.filter === 'listing') {
    return {
      deal_type: ['Selling'],
      query: searchQuery.term,
      status: {
        is_archived: false
      },
      $order: ['deals.created_at', 'DESC']
    }
  }

  if (searchQuery.filter === 'contract') {
    return {
      deal_type: ['Buying'],
      query: searchQuery.term,
      status: {
        is_archived: false
      },
      $order: ['deals.created_at', 'DESC']
    }
  }

  return {}
}
