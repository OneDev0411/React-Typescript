import { ThunkDispatch } from 'redux-thunk'

import { updateEmailTemplate as update } from 'models/email-templates/update-email-template'
import { EmailTemplateAction } from 'reducers/email-templates/types'

import * as actionTypes from '../../constants/email-templates'

export const updateEmailTemplate = (
  brandId: string,
  templateId: string,
  updates: IBrandEmailTemplateInput
) => async (dispatch: ThunkDispatch<any, any, EmailTemplateAction>) => {
  try {
    const template = await update(brandId, templateId, updates)

    dispatch({
      type: actionTypes.UPDATE_EMAIL_TEMPLATE,
      brandId,
      template: {
        ...template,
        editable: true
      }
    })

    return template
  } catch (error) {
    throw error
  }
}
