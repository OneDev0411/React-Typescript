import { getField } from 'models/Deal/helpers/context/get-field'
import { getType, Types } from 'deals/FormEdit/utils/types'
import { searchContext } from 'models/Deal/helpers/dynamic-context'

import { getAnnotationsByType } from '../get-annotations-by-type'
import { getInputAnnotations } from '../get-input-annotations'
import { getGroupValues } from '../get-group-values'
import { normalizeCheckboxValue } from '../normalize-checkbox-value'
import { getRoleText } from '../get-roles-text'
import { formatDate } from '../format-date'

export function populateFormValues(
  annotations,
  fields,
  { deal, roles, defaultValues }
) {
  return {
    ...fields,
    ...defaultValues,
    ...getCheckboxes(annotations),
    ...getContexts(annotations, deal, fields),
    ...getRoles(annotations, deal, roles)
  }
}

function getCheckboxes(annotations) {
  return getInputAnnotations(annotations)
    .filter(item => getType(item.annotation) === Types.CHECKBOX_ANNOTATION)
    .reduce((acc, item) => {
      return {
        ...acc,
        [item.annotation.fieldName]: normalizeCheckboxValue(
          item.annotation.fieldValue
        )
      }
    }, {})
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
  const context = searchContext(deal.id, annotation.context)

  if (!context || annotation.disableAutopopulate) {
    return formValue
  }

  const contextValue = getField(deal, annotation.context)

  if (!contextValue && contextValue !== 0) {
    return formValue
  }

  if (context.data_type === 'Number' && context.format === 'Currency') {
    return contextValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  if (context.data_type === 'Date') {
    return formatDate(
      Number.isNaN(contextValue) ? contextValue : contextValue * 1000
    )
  }

  return contextValue
}
