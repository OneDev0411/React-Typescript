// ConciergeDispatcher.js
import { Dispatcher } from './flux'

// Listings
import getDeals from '../actions/concierge/get-deals'
import setReview from '../actions/concierge/set-review'
import getEnvelopes from '../actions/concierge/get-envelopes'
import getSubmissions from '../actions/concierge/get-submissions'

const ConciergeDispatcher = new Dispatcher()

// Register callback with AppDispatcher
ConciergeDispatcher.register(async (payload) => {
  switch (payload.type) {
    case 'GET_DEALS':
      getDeals(payload.user)
      break
    case 'GET_ENVELOPES':
      return await getEnvelopes(payload.user, payload.dealId)
    case 'GET_SUBMISSIONS':
      return await getSubmissions(payload.user, payload.dealId)
    case 'SET_REVIEW':
      return await setReview(payload.id, payload.body, payload.user)
    default:
      return true
  }
})

export default ConciergeDispatcher
