

import { getEnvelopes } from '../../models/Concierge'
import AppStore from '../../stores/AppStore'

export default async function (user, dealId) {
  const params = {
    dealId,
    token: user.access_token
  }
  try {
    const deals = AppStore.data.conciergeDeals
    const envelopes = await getEnvelopes(params) || []

    const newDeals = deals.map((deal, index) => {
      if (deal.id !== dealId)
        return deal

      return {
        ...deal,
        envelopes
      }
    })
    AppStore.data.conciergeDeals = newDeals
    return envelopes
  } catch (error) {
    console.log(`getEnvelopes: ${error}`)
    throw error
  }
}
