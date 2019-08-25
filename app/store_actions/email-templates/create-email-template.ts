import * as actionTypes from 'constants/email-templates'

import { ThunkDispatch } from 'redux-thunk'

import { EmailTemplateAction } from 'reducers/email-templates/types'
import { createEmailTemplate as create } from 'models/email-templates/create-email-template'

export const createEmailTemplate = (
  brandId: string,
  templateInput: IBrandEmailTemplateInput
) => async (dispatch: ThunkDispatch<any, any, EmailTemplateAction>) => {
  try {
    const template = await create(brandId, templateInput)

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
