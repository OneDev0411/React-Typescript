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

    if (response.status === 200)
      AppStore.data.deals.forms = _.map(response.body.data, f => {
        return {
          id: f.id,
          title: f.name,
          roles: f.roles,
          state: 'In Progress',
          created_at: f.created_at
        }
      })

    AppStore.emitChange()
  }
  catch(e) {}
}
