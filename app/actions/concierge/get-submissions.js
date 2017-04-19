

import { getSubmissions } from '../../models/Concierge'
import AppStore from '../../stores/AppStore'

export default async function (user, dealId) {
  const params = {
    dealId,
    token: user.access_token
  }
  // let dealIndex = 0
  try {
    const { deals } = AppStore.data.conciergeDeals
    const submissions = await getSubmissions(params) || []

    const newDeals = deals.map((deal, index) => {
      if (deal.id !== dealId)
        return deal

      // dealIndex = index
      return {
        ...deal,
        submissions
      }
    })
    // AppStore.emitChange()
    // console.log('hasEnvelope', dealIndex, AppStore.data.conciergeDeals[dealIndex])

    AppStore.data.conciergeDeals.deals = newDeals

    // if (!isUpdated)
    //   AppStore.data.conciergeDeals.isUpdated = true

    return submissions
  } catch (error) {
    throw error
  }
}
