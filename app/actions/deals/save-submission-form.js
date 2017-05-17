// actions/deals/save-deal-form.js
import Deal from '../../models/Deal'
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
    const response = await Deal.saveSubmissionForm(params)

    if (response.status === 200) {
      const deal = AppStore.data.deals.list[deal_id]

      if (!submission)
        submission = response.body.data.id

      deal.submissions[submission] = {
        ...response.body.data,
        ...{form_data: { values }}
      }
    }

  } catch (e) {}
}
