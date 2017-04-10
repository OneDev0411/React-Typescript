// actions/deals/get-submission-form.js
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'
import _ from 'underscore'

export default async function (user, deal_id, id) {
  const params = {
    access_token: user.access_token,
    id
  }

  try {
    const response = await Deals.getSubmissionForm(params)

    if (response.status !== 200)
      return false

    const deal_index = _.findIndex(AppStore.data.deals, deal => deal.id === deal_id)
    const submission_index = _.findIndex(AppStore.data.deals[deal_index].submissions,
      subm => subm.last_revision === id)

    AppStore.data.deals[deal_index].submissions[submission_index].form_data = response.body.data
    AppStore.emitChange()
  } catch (e) {}
}
