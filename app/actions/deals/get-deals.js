// actions/deals/get-deals.js
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'
import _ from 'underscore'

export default async function (user) {
  const params = {
    access_token: user.access_token
  }

  try {
    const response = await Deals.getDeals(params)

    if (response.status === 200) {
      const list = _.indexBy(response.body.data, 'id')
      AppStore.data.deals = Object.assign(AppStore.data.deals || {}, { list })
    }

    AppStore.emitChange()
  }
  catch(e) {
  }
}
