// ConciergeDispatcher.js
import { Dispatcher } from './flux'

import getDeals from '../actions/concierge/get-deals'
import setReview from '../actions/concierge/set-review'
import getEnvelopes from '../actions/concierge/get-envelopes'
import getSubmissions from '../actions/concierge/get-submissions'
import submitReviewRequest from '../actions/deals/submit-review-request'



const ConciergeDispatcher = new Dispatcher()

// Register callback with AppDispatcher
ConciergeDispatcher.register(async (payload) => {
  switch (payload.type) {
    case 'GET_DEALS':
      getDeals(payload.user)
      break
    case 'GET_ENVELOPES':
      return getEnvelopes(payload.user, payload.dealId)
    case 'GET_SUBMISSIONS':
      return getSubmissions(payload.user, payload.dealId)
    case 'SET_REVIEW':
      return setReview(payload.id, payload.body, payload.user)
    case 'SUBMIT_REVIEW_REQUEST':
      return submitReviewRequest(payload.id, payload.body, payload.token)
    default:
      return true
  }
})

export default ConciergeDispatcher
