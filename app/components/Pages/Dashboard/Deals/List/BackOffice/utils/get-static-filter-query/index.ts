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
      }
    }
  }

  if (searchQuery.filter === 'contract') {
    return {
      contexts: {
        contract_status: {
          text: statuses
            .filter(
              item =>
                item.deal_types.includes('Buying') && item.is_archived === false
            )
            .map(item => item.label)
        }
      }
    }
  }

  return {}
}
