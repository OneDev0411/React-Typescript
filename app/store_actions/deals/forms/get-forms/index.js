import _ from 'underscore'

import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function getForms() {
  return async dispatch => {
    try {
      const forms = await Deal.getForms()
      const indexedForms = _.indexBy(forms, 'id')

      dispatch({
        type: actionTypes.GET_FORMS,
        forms: indexedForms
      })

      return indexedForms
    } catch (e) {
      throw e
    }
  }
}
