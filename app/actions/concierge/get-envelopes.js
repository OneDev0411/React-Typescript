// actions/concierge/get-deals.js
import Concierge from '../../models/Concierge'
import AppStore from '../../stores/AppStore'
import _ from 'underscore'

export default (user, deal_id) => {
  const params = {}

  if (user) {
    params.user = user.access_token
    params.deal_id = deal_id
  }

  Concierge.getEnvelopes(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      const index = _.findIndex(AppStore.data.concierge_deals, deal => deal.id === deal_id)
      AppStore.data.concierge_deals[index].envelopes = response.data
    }

    AppStore.emitChange()
  })
}
