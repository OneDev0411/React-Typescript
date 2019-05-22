import { getField } from 'models/Deal/helpers/context/get-field'
import { getContext } from 'models/Deal/helpers/context/get-context'

import { getAnnotationsByType } from '../get-annotations-by-type'
import { getGroupValues } from '../get-group-values'
import { normalizeFormValue } from '../normalize-form-value'
import { getRoleText } from '../get-roles-text'

export function populateFormValues(annotations, fields, { deal, roles }) {
  return {
    ...fields,
    ...getContexts(annotations, deal, fields),
    ...getRoles(annotations, deal, roles)
  }
}

function getContexts(annotations, deal, fields) {
  return ['addresses', 'contexts'].reduce(
    (current, type) => ({
      ...current,
      ...getContextsByType(annotations, type, deal, fields)
    }),
    {}
  )
}

function getContextsByType(annotations, type, deal, fields) {
  return getAnnotationsByType(annotations, type).reduce((current, group) => {
    const contextName = group[0].context

    const value = normalizeFormValue(
      group[0],
      getContext(deal, contextName),
      getField(deal, contextName),
      getFormValue(group, fields)
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

function getFormValue(group, fields) {
  return group
    .map(item => fields[item.annotation.fieldName])
    .join(' ')
    .trim()
}
