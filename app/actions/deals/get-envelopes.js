// actions/deals/get-envelopes.js
import _ from 'underscore'
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'

export default (id, user) => {
  const params = {
    id,
    user: user.access_token
  }

  Deals.getEnvelopes(params, (err, response) => {

    // Success
    if (response.status === 200) {
      const index = _.findIndex(AppStore.data.deals, deal => deal.id === id)
      AppStore.data.deals[index].envelopes = response.body.data
    }

    AppStore.emitChange()
  })
}
