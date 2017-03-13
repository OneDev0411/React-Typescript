// actions/deals/get-deals.js
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'

export default (user) => {
  const params = {}

  if (user) {
    params.user = user.access_token
  }

  Deals.getDeals(params, (err, response) => {
    // Success
    if (response.status === 200)
      AppStore.data.deals = response.body.data

    AppStore.emitChange()
  })
}
