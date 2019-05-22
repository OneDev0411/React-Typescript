import { getField } from 'models/Deal/helpers/context/get-field'
import { getContext } from 'models/Deal/helpers/context/get-context'

import { getAnnotationsByType } from '../get-annotations-by-type'
import { getGroupValues } from '../get-group-values'
import { normalizeFormValue } from '../normalize-form-value'
import { getRoleText } from '../get-roles-text'
import { formatDate } from '../format-date'
import { contextOverwriteValues } from '../context-overwrite-values'

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

    const value = normalizeContextValue(
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

function normalizeContextValue(annotation, context, value, formValue = '') {
  if (
    !context ||
    !value ||
    annotation.disableAutopopulate ||
    contextOverwriteValues.includes(formValue)
  ) {
    return formValue
  }

  if (context.data_type === 'Number') {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  if (context.data_type === 'Date') {
    return formatDate(isNaN(value) ? value : value * 1000)
  }

  return value
}
