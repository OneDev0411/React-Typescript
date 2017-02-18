// ConciergeDispatcher.js
import { Dispatcher } from 'flux'

// Listings
import getDeals from '../actions/concierge/get-deals'

const ConciergeDispatcher = new Dispatcher()

// Register callback with AppDispatcher
ConciergeDispatcher.register(payload => {
  const action = payload.action

  switch (action) {

    case 'get-deals':
      getDeals(payload.user, payload.q)
      break

    default:
      return true
  }
  return true
})

export default ConciergeDispatcher
