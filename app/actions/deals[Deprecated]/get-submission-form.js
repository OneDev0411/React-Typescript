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

    const deal = AppStore.data.deals.list[deal_id]
    const submission = _.find(deal.submissions, subm => subm.last_revision === id)
    deal.submissions[submission.id].form_data = response.body.data

    return response.body.data
  } catch (e) {}
}
