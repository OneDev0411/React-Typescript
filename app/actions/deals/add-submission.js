// actions/deals/get-deal-forms.js
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'
import _ from 'underscore'

export default async function (id, form) {
  const index = _.findIndex(AppStore.data.deals, deal => deal.id === id)
  AppStore.data.deals[index].submissions.unshift(form)

  AppStore.emitChange()
}
