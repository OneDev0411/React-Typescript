/**
 * Get templates types based on listing status
 * @param {Listing} listing
 * @return {Array}
 */
export function getTemplateTypes(listing) {
  if (!listing) {
    return []
  }

  if (Array.isArray(listing) && listing.length > 1) {
    return ['Listings']
  }

  if (listing.status === 'Sold') {
    return ['JustSold']
  }

  return [
    'JustListed',
    'PriceImprovement',
    'AsSeenIn',
    'ComingSoon',
    'OpenHouse'
  ]
}
