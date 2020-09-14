import { SearchQuery } from '../../types'

/**
 * returns query param of static filters
 * @param user
 * @param searchQuery
 */
export function getStaticFilterQuery(
  searchQuery: SearchQuery,
  statuses: IDealStatus[] = []
): object {
  if (searchQuery.filter === 'listing') {
    return {
      is_draft: false,
      deal_type: ['Selling'],
      query: searchQuery.term,
      contexts: {
        listing_status: {
          text: statuses
            .filter(
              item =>
                item.deal_types.includes('Selling') &&
                item.is_archived === false
            )
            .map(item => item.label)
        }
      },
      $order: ['deals.created_at', 'DESC']
    }
  }

  if (searchQuery.filter === 'contract') {
    return {
      is_draft: false,
      deal_type: ['Buying'],
      query: searchQuery.term,
      contexts: {
        contract_status: {
          text: statuses
            .filter(
              item =>
                item.deal_types.includes('Buying') && item.is_archived === false
            )
            .map(item => item.label)
        }
      },
      $order: ['deals.created_at', 'DESC']
    }
  }

  return {}
}
