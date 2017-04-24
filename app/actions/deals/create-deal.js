// actions/deals/create-deal.js
import _ from 'underscore'
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'

export default async function (data, user) {
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
    const deal = response.body.data
    AppStore.data.deals.list[deal.id] = deal
    AppStore.emitChange()

    return response.body.data
  }

  return null
}
