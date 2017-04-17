

import { getEnvelopes } from '../../models/Concierge'
import AppStore from '../../stores/AppStore'

export default async function (user, dealId) {
  const params = {
    dealId,
    token: user.access_token
  }
  // let dealIndex = 0
  try {
    const envelopes = await getEnvelopes(params) || []
    AppStore.data.conciergeDeals =
      AppStore.data.conciergeDeals.map((deal, index) => {
        if (deal.id !== dealId)
          return deal

        // dealIndex = index
        return {
          ...deal,
          envelopes
        }
      })
    // console.log('hasEnvelope', dealIndex, AppStore.data.conciergeDeals[dealIndex])
    return envelopes
  } catch (error) {
    console.log(`getEnvelopes: ${error}`)
    throw error
  }
}

// 933937cc-0500-11e7-820d-0242ac110006
