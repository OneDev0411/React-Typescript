/**
 * Get templates types based on listing status
 * @param {Listing} listing
 * @return {Array}
 */
export function getTemplateTypes(listing) {
  if (!listing) {
    return []
  }

  if (Array.isArray(listing)) {
    return ['Listings']
  }

  if (listing.status === 'Sold') {
    return ['JustSold']
  }

  if (listing.open_houses) {
    return ['OpenHouse', 'JustListed', 'PriceImprovement']
  }

  return ['JustListed', 'PriceImprovement', 'AsSeenIn', 'ComingSoon']
}
