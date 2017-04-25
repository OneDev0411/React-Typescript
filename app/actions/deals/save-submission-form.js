// actions/deals/save-deal-form.js
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'
import _ from 'underscore'

export default async function (user, type, deal_id, form, state, values, submission) {
  const params = {
    access_token: user.access_token,
    type,
    form,
    deal_id,
    state,
    values,
    submission
  }

  try {

    // request for save
    const response = await Deals.saveSubmissionForm(params)

    if (response.status === 200) {
      const deal = AppStore.data.deals.list[deal_id]
      const submission = _.find(deal.submissions, subm => subm.form === form)
      deal.submissions[submission.id].form_data.values = values
    }

  } catch (e) {}
}
