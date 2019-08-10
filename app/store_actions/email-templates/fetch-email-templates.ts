import * as actionTypes from 'constants/email-templates'

import { ThunkDispatch } from 'redux-thunk'

import { EmailTemplateAction } from 'reducers/email-templates/types'
import { getEmailTemplates } from 'models/email-templates/get-email-templates'

export const fetchEmailTemplates = (brandId: string) => async (
  dispatch: ThunkDispatch<any, any, EmailTemplateAction>
) => {
  try {
    const templates = await getEmailTemplates(brandId)

    dispatch({
      type: actionTypes.UPDATE_EMAIL_TEMPLATES,
      brandId,
      templates
    })

    return
  } catch (error) {
    throw error
  }
}
