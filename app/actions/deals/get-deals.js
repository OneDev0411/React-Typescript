// actions/deals/get-deals.js
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'

export default async function (user) {
  const params = {
    access_token: user.access_token
  }

  try {
    const response = await Deals.getDeals(params)

    if (response.status === 200)
      AppStore.data.deals = response.body.data

    AppStore.emitChange('deals')
  }
  catch(e) {
  }
}
