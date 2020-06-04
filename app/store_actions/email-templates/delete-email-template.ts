import { ThunkDispatch } from 'redux-thunk'

import * as actionTypes from 'constants/email-templates'

import { EmailTemplateAction } from 'reducers/email-templates/types'
import { deleteEmailTemplate as deleteTemplate } from 'models/email-templates/delete-email-template'

export const deleteEmailTemplate = (brandId: UUID, templateId: UUID) => async (
  dispatch: ThunkDispatch<any, any, EmailTemplateAction>
) => {
  try {
    await deleteTemplate(brandId, templateId)

    dispatch({
      type: actionTypes.DELETE_EMAIL_TEMPLATE,
      brandId,
      templateId
    })
  } catch (error) {
    throw error
  }
}
