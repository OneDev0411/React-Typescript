// actions/deals/get-submissions.js
import _ from 'underscore'
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'

export default async function (id, user) {
  const params = {
    id,
    access_token: user.access_token
  }

  try {
    const response = await Deals.getSubmissions(params)

    if (response.status === 200)
      AppStore.data.deals.list[id].submissions = _.indexBy(response.body.data, 'id')

    AppStore.emitChange()
  }
  catch(e) {}
}
