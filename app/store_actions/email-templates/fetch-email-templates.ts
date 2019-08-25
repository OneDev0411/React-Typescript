import * as actionTypes from 'constants/email-templates'

import { ThunkDispatch } from 'redux-thunk'

import { IAppState } from 'reducers/index'
import { EmailTemplateAction } from 'reducers/email-templates/types'
import { getEmailTemplates } from 'models/email-templates/get-email-templates'

import { selectEmailTemplatesIsFetching } from 'reducers/email-templates'

export const fetchEmailTemplates = (brandId: UUID) => async (
  dispatch: ThunkDispatch<any, any, EmailTemplateAction>,
  getState: () => IAppState
) => {
  if (selectEmailTemplatesIsFetching(getState().emailTemplates, brandId)) {
    return Promise.resolve()
  }

  try {
    dispatch({
      type: actionTypes.FETCH_EMAIL_TEMPLATES_REQUEST,
      brandId
    })

    const templates = await getEmailTemplates(brandId)

    dispatch({
      type: actionTypes.FETCH_EMAIL_TEMPLATES_SUCCESS,
      brandId,
      templates: templates.map(template => ({
        ...template,
        editable: template.brand === brandId
      }))
    })

    return
  } catch (error) {
    dispatch({
      type: actionTypes.FETCH_EMAIL_TEMPLATES_FAILURE,
      brandId,
      errorMessage: error.message
    })
  }
}
