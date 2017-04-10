// actions/deals/get-envelopes.js
import _ from 'underscore'
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'

export default async function (id, user) {
  const params = {
    id,
    access_token: user.access_token
  }

  try {
    const response = await Deals.getEnvelopes(params)

    if (response.status === 200) {
      const index = _.findIndex(AppStore.data.deals, deal => deal.id === id)
      AppStore.data.deals[index].envelopes = response.body.data
    }

    AppStore.emitChange('deals')
  }
  catch(e) {}
}
