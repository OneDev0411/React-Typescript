import _ from 'underscore'

import * as actionTypes from '../../../../constants/deals'
import Deal from '../../../../models/Deal'

export function getForms() {
  return async dispatch => {
    try {
      const forms = await Deal.getForms()

      dispatch({
        type: actionTypes.GET_FORMS,
        forms: _.indexBy(forms, 'id')
      })
    } catch (e) {
      throw e
    }
  }
}
