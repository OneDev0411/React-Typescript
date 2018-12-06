import _ from 'underscore'

import Deal from 'models/Deal'

const sellingOrders = [
  'Coming Soon',
  'Active',
  'Pending',
  'Active Option Contract',
  'Active Contingent',
  'Active Kick Out',
  'Sold',
  'Lease Contract'
]

const buyingOrders = ['Sold']

/**
 * returns a list of deals to show as initial list in listings drawer
 * @param {Object} deals - list of deals
 * the filtering and sorting logic is a bit strange
 * https://gitlab.com/rechat/templates/issues/13#note_122552988
 */
/** */
export function getMlsDrawerInitialDeals(deals) {
  return _.chain(deals)
    .filter(deal => {
      const status = Deal.get.status(deal)

      if (
        (deal.deal_type === 'Selling' && !sellingOrders.includes(status)) ||
        (deal.deal_type === 'Buying' && !buyingOrders.includes(status)) ||
        deal.listing === null
      ) {
        return false
      }

      return true
    })
    .sortBy(deal => {
      const status = Deal.get.status(deal)

      const primaryOrder = deal.deal_type === 'Selling' ? 1 : 2
      const secondaryOrder =
        deal.deal_type === 'Selling'
          ? sellingOrders.indexOf(status)
          : buyingOrders.indexOf(status)

      return primaryOrder * 10 + secondaryOrder
    })
    .value()
}
