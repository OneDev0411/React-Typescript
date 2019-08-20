import omit from 'lodash/omit'
import keyBy from 'lodash/keyBy'

import * as actionTypes from '../../constants/email-templates'
import { EmailTemplateAction, IEmailTemplatesState } from './types'

const initialState: IEmailTemplatesState = {}

export function emailTemplates(
  state: IEmailTemplatesState = initialState,
  action: EmailTemplateAction
) {
  const brand = action.brandId
  const brandState = state[brand] || {}

  if (action.type === actionTypes.UPDATE_EMAIL_TEMPLATE) {
    return {
      ...state,
      [brand]: {
        ...brandState,
        templates: {
          ...brandState.templates,
          [action.template.id]: action.template
        }
      }
    }
  }

  if (action.type === actionTypes.FETCH_EMAIL_TEMPLATES_REQUEST) {
    return {
      ...state,
      [brand]: {
        ...brandState,
        isFetching: true
      }
    }
  }

  if (action.type === actionTypes.FETCH_EMAIL_TEMPLATES_SUCCESS) {
    return {
      ...state,
      [brand]: {
        error: '',
        isFetching: false,
        templates: keyBy(action.templates, 'id')
      }
    }
  }

  if (action.type === actionTypes.FETCH_EMAIL_TEMPLATES_FAILURE) {
    return {
      ...state,
      [brand]: {
        ...brandState,
        isFetching: false,
        error: action.errorMessage
      }
    }
  }

  if (action.type === actionTypes.DELETE_EMAIL_TEMPLATE) {
    return {
      ...state,
      [brand]: {
        ...brandState,
        templates: omit(brandState.templates, action.templateId)
      }
    }
  }

  return state
}

export function selectEmailTemplates(
  state: IEmailTemplatesState,
  brandId: string
): IBrandEmailTemplate[] {
  if (!state[brandId]) {
    return []
  }

  return Object.values(state[brandId].templates || {})
}

export function selectEmailTemplatesIsFetching(
  state: IEmailTemplatesState,
  brandId: string
): boolean {
  if (!state[brandId]) {
    return false
  }

  return state[brandId].isFetching || false
}

export function selectEmailTemplatesError(
  state: IEmailTemplatesState,
  brandId: string
): string {
  if (!state[brandId]) {
    return ''
  }

  return state[brandId].error || ''
}
