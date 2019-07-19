import * as actionTypes from '../../../../constants/deals'
import { getForms as loadForms } from '../../../../models/Deal/form/get-forms'

export function getForms(brandId) {
  return async dispatch => {
    try {
      if (!brandId) {
        throw new Error(`Can not get forms. brandId is ${brandId}`)
      }

      const forms = await loadForms(brandId)
      const formsById = forms.reduce((acc, form) => {
        return {
          ...acc,
          [form.id]: form
        }
      }, {})

      dispatch({
        type: actionTypes.GET_FORMS,
        forms: formsById,
        brandId
      })

      return formsById
    } catch (e) {
      throw e
    }
  }
}
