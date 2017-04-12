// ConciergeDispatcher.js
import { Dispatcher } from './flux'

// Listings
import getDeals from '../actions/concierge/get-deals'
import getEnvelopes from '../actions/concierge/get-envelopes'
import getSubmissions from '../actions/concierge/get-submissions'

const ConciergeDispatcher = new Dispatcher()

// Register callback with AppDispatcher
ConciergeDispatcher.register((payload) => {
  const action = payload.action

  switch (action) {

    case 'get-deals':
      getDeals(payload.user, payload.q)
      break

    case 'get-envelopes':
      getEnvelopes(payload.user, payload.deal_id, payload.q)
      break

    case 'get-submissions':
      getSubmissions(payload.user, payload.deal_id, payload.q)
      break

    default:
      return true
  }
  return true
})

export default ConciergeDispatcher
