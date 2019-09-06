import * as actionTypes from '../../../../constants/deals'
import { getForms as loadForms } from '../../../../models/Deal/form/get-forms'

export function getForms(dealId) {
  return async dispatch => {
    try {
      const forms = await loadForms(dealId)
      const formsById = forms.reduce((acc, form) => {
        return {
          ...acc,
          [form.id]: form
        }
      }, {})

      dispatch({
        type: actionTypes.GET_FORMS,
        forms: formsById,
        dealId
      })

      return formsById
    } catch (e) {
      throw e
    }
  }
}
