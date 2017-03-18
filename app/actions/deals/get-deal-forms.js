// actions/deals/get-deal-forms.js
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'
import _ from 'underscore'

export default async function(user)  {
  const params = {
    token: user.access_token
  }

  try {
    const response = await Deals.getForms(params)
    console.log(response)

    if (response.status === 200)
      AppStore.data.deals.forms = _.map(response.body, f => {
        return { id: f.id, name: f.name }
      })

    AppStore.emitChange()
  }
  catch(e) {
    console.log('>', e)
  }
}
