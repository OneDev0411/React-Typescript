import keyBy from 'lodash/keyBy'

import * as actionTypes from '../../constants/email-templates'
import { EmailTemplateAction, IEmailTemplatesState } from './types'

const initialState: IEmailTemplatesState = {}

export function emailTemplates(
  state: IEmailTemplatesState = initialState,
  action: EmailTemplateAction
) {
  if (action.type === actionTypes.UPDATE_EMAIL_TEMPLATE) {
    return {
      ...state,
      [action.brandId]: {
        ...(state[action.brandId] || {}),
        [action.template.id]: action.template
      }
    }
  }

  if (action.type === actionTypes.UPDATE_EMAIL_TEMPLATES) {
    return {
      ...state,
      [action.brandId]: keyBy(action.templates, 'id')
    }
  }

  return state
}

export function selectEmailTemplates(
  state: IEmailTemplatesState,
  brandId: string
) {
  return Object.values(state[brandId] || {})
}
