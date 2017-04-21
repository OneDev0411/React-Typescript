

import { getSubmissions } from '../../models/Concierge'
import AppStore from '../../stores/AppStore'

export default async function (user, dealId) {
  const params = {
    dealId,
    token: user.access_token
  }
  try {
    const deals = AppStore.data.conciergeDeals
    const submissions = await getSubmissions(params) || []

    const newDeals = deals.map((deal, index) => {
      if (deal.id !== dealId)
        return deal

      return {
        ...deal,
        submissions
      }
    })
    AppStore.data.conciergeDeals = newDeals
    return submissions
  } catch (error) {
    throw error
  }
}
