// actions/deals/get-deal-forms.js
import Deals from '../../models/Deal'
import AppStore from '../../stores/AppStore'
import _ from 'underscore'

export default async function (id, form) {
  AppStore.data.deals.list[id].submissions.unshift(form)

  AppStore.emitChange()
}
