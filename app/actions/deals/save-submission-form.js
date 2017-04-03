// actions/deals/save-deal-form.js
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'
import _ from 'underscore'

export default async function (user, type, deal, form, state, values, submission) {
  const params = {
    access_token: user.access_token,
    type,
    form,
    deal,
    state,
    values,
    submission
  }

  const deal_index = _.findIndex(AppStore.data.deals, d => d.id === deal)

  try {
    // saving form
    AppStore.data.deals[deal_index].saving_form = true
    AppStore.emitChange()

    // request for save
    const response = await Deals.saveSubmissionForm(params)

    if (response.status === 200) {
      const submission_index = _.findIndex(AppStore.data.deals[deal_index].submissions,
      subm => subm.form === form)

      AppStore.data.deals[deal_index].submissions[submission_index].form_data.values = values
    }

  } catch (e) {}

  AppStore.data.deals[deal_index].saving_form = false
  AppStore.emitChange()
}
