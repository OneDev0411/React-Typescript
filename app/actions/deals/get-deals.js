// actions/deals/get-deals.js
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'
import _ from 'underscore'
import moment from 'moment'

export default async function (user) {
  const params = {
    access_token: user.access_token
  }

  try {
    const response = await Deals.getDeals(params)

    if (response.status === 200) {
      const list = _.indexBy(response.body.data, 'id')

      // expire deals after 12 minutes
      const expire_at = moment().add(12, 'minutes')

      AppStore.data.deals = Object.assign(AppStore.data.deals || {}, {
        list,
        expire_at
      })
    }

    AppStore.emitChange()
  }
  catch(e) {
  }
}
