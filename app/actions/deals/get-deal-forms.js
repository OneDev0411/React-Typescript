// actions/deals/get-deal-forms.js
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'
import _ from 'underscore'

export default async function (user) {
  const params = {
    token: user.access_token
  }

  try {
    const response = await Deals.getForms(params)

    if (response.status === 200) {
      const forms = _.map(response.body.data, f => ({
        id: f.id,
        title: f.name,
        roles: f.roles,
        state: 'In Progress',
        created_at: f.created_at
      }))

      const deals = Object.assign(AppStore.data.deals || {}, { forms })
      AppStore.data.deals = deals
    }

    AppStore.emitChange()
  } catch (e) {}
}
