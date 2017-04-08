// actions/deals/create-deal.js
import _ from 'underscore'
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'

export default async (context, user) => {
  const params = {
    context,
    access_token: user.access_token
  }

  let response = {}

  console.log(AppStore.data)
  return
  try {
    response = await Deals.create(params)
  }
  catch(e) { /* nothing */ }

  console.log(response)
  if (response.status === 200) {
    AppStore.data.deals.push(response.body.data)
  }

  AppStore.emitChange()
}
