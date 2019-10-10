import { SearchQuery } from '../../types'

/**
 * returns page title
 * @param searchQuery
 */
export function getPageTitle(searchQuery: SearchQuery): string {
  if (searchQuery.type === 'inbox') {
    return searchQuery.filter
  }

  if (searchQuery.type === 'query' && searchQuery.filter === 'listing') {
    return 'All Listing Deals'
  }

  if (searchQuery.type === 'query' && searchQuery.filter === 'contract') {
    return 'All Contract Deals'
  }

  return 'Deals'
}
