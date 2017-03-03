// actions/concierge/get-deals.js
import Concierge from '../../models/Concierge'
import AppStore from '../../stores/AppStore'

export default (user) => {
  const params = {}

  if (user) {
    params.user = user.access_token
    params.brand_id = user.brand
  }

  Concierge.getDeals(params, (err, response) => {
    // Success
    if (response.status === 'success')
      AppStore.data.concierge_deals = response.data

    AppStore.emitChange()
  })
}
