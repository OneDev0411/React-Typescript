

import { getSubmissions } from '../../models/Concierge'
import AppStore from '../../stores/AppStore'

export default async function (user, dealId) {
  const params = {
    dealId,
    token: user.access_token
  }
  // let dealIndex = 0
  try {
    const submissions = await getSubmissions(params) || []
    AppStore.data.conciergeDeals = AppStore.data.conciergeDeals.map((deal, index) => {
      if (deal.id !== dealId)
        return deal

      // dealIndex = index
      return {
        ...deal,
        submissions
      }
    })
    // console.log('hasSubmission', AppStore.data.conciergeDeals[dealIndex])
    return submissions
  } catch (error) {
    console.log(`getSubmissions: ${error}`)
    throw error
  }
}
