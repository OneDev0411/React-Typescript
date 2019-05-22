import { getField } from 'models/Deal/helpers/context/get-field'
import { getContext } from 'models/Deal/helpers/context/get-context'

import { getAnnotationsByType } from '../get-annotations-by-type'
import { getGroupValues } from '../get-group-values'
import { normalizeFormValue } from '../normalize-form-value'
import { getRoleText } from '../get-roles-text'

export function populateFormValues(annotations, values, { deal, roles }) {
  return {
    ...values,
    ...getContexts(annotations, deal),
    ...getRoles(annotations, deal, roles)
  }
}

function getContexts(annotations, deal) {
  return ['addresses', 'contexts'].reduce(
    (current, type) => ({
      ...current,
      ...getContextsByType(annotations, type, deal)
    }),
    {}
  )
}

function getContextsByType(annotations, type, deal) {
  return getAnnotationsByType(annotations, type).reduce((current, group) => {
    const contextName = group[0].context

    const value = normalizeFormValue(
      getContext(deal, contextName),
      getField(deal, contextName)
    )

    return {
      ...current,
      ...getGroupValues(group, value)
    }
  }, {})
}

function getRoles(annotations, deal, roles) {
  return getAnnotationsByType(annotations, 'roles').reduce((current, group) => {
    const value = getRoleText(roles, deal, group[0].role, group[0])

    return {
      ...current,
      ...getGroupValues(group, value)
    }
  }, {})
}
