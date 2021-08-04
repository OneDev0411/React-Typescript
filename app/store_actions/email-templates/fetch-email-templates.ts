import { ThunkDispatch } from 'redux-thunk'

import * as actionTypes from 'constants/email-templates'
import { getEmailTemplates } from 'models/email-templates/get-email-templates'
import { IAppState } from 'reducers'
import { selectEmailTemplatesIsFetching } from 'reducers/email-templates'
import { EmailTemplateAction } from 'reducers/email-templates/types'

export const fetchEmailTemplates =
  (brandId: UUID) =>
  async (
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
