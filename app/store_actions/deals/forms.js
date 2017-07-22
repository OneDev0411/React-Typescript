import _ from 'underscore'
import types from '../../constants/deals'
import Deals from '../../models/Deal'

function initializeForms(forms) {
  return {
    type: types.GET_FORMS,
    forms
  }
}

export function getForms() {
  return async (dispatch) => {
    const forms = await Deals.getForms()
    const indexedForms = _.indexBy(forms, 'id')

    dispatch(initializeForms(indexedForms))
  }
}
