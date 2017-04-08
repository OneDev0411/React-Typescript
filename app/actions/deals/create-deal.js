// actions/deals/create-deal.js
import _ from 'underscore'
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'

export default async (data, user) => {
  const params = {
    data,
    access_token: user.access_token
  }

  let response = {}

  try {
    response = await Deals.create(params)
  }
  catch(e) { /* nothing */ }

  if (response.status === 200) {
    AppStore.data.deals.push(response.body.data)
    AppStore.emitChange()

    return response.body.data
  }

  return null
}
