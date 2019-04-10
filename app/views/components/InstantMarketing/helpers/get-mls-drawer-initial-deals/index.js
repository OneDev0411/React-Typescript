import _ from 'underscore'

/**
 * returns a list of deals to show as initial list in listings drawer
 * @param {Object} deals - list of deals
 * @param {Boolean} keepDealsWithoutListing - keep deals without listing
 * the filtering and sorting logic is a bit strange
 * https://gitlab.com/rechat/templates/issues/13#note_122552988
 */
/** */
export function getMlsDrawerInitialDeals(
  deals,
  keepDealsWithoutListing = false
) {
  const chain = keepDealsWithoutListing
    ? _.chain(deals)
    : _.chain(deals).filter(deal => deal.listing !== null)

  return chain.sortBy(deal => (deal.deal_type === 'Selling' ? 1 : 2)).value()
}
