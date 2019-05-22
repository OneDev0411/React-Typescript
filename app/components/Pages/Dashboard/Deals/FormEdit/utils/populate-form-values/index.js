import { getField } from 'models/Deal/helpers/context/get-field'
import { getContext } from 'models/Deal/helpers/context/get-context'

import { getAnnotationsByType } from '../get-annotations-by-type'
import { getGroupValues } from '../get-group-values'
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
    const value = normalizeContextValue(
      deal,
      group[0],
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

function normalizeContextValue(deal, annotation, formValue = '') {
  const context = getContext(deal, annotation.context)

  if (
    !context ||
    annotation.disableAutopopulate ||
    contextOverwriteValues.includes(formValue)
  ) {
    return formValue
  }

  const contextValue = getField(deal, annotation.context)

  if (!contextValue && contextValue !== 0) {
    return formValue
  }

  if (context.data_type === 'Number') {
    return contextValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  if (context.data_type === 'Date') {
    return formatDate(isNaN(contextValue) ? contextValue : contextValue * 1000)
  }

  return contextValue
}
