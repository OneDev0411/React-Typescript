import { SearchQuery } from '../../types'

/**
 * returns query param of static filters
 * @param user
 * @param searchQuery
 */
export function getStaticFilterQuery(searchQuery: SearchQuery): object {
  if (searchQuery.filter === 'listing') {
    return {
      contexts: {
        listing_status: {
          text: [
            'Coming Soon',
            'Active',
            'Pending',
            'Temp Off Market',
            'Active Option Contract',
            'Active Contingent',
            'Active Kick Out'
          ]
        }
      }
    }
  }

  if (searchQuery.filter === 'contract') {
    return {
      contexts: {
        contract_status: {
          text: [
            'Lease Contract',
            'Active Option Contract',
            'Active Contingent',
            'Active Kick Out',
            'Pending'
          ]
        }
      }
    }
  }

  return {}
}
