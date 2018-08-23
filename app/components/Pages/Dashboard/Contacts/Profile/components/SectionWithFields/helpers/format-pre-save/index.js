import { flatten, indexBy } from 'underscore'

import { isNumeric } from '../../../../../../../../../utils/helpers'
import { getParser } from '../get-parser'

export function formatPreSave(previousFields, nextFields) {
  let upsertedAttributeList = []
  let deletedAttributesList = []

  nextFields = flatten(Object.values(nextFields))

  const previousFieldsIndexedById = indexBy(previousFields, 'id')
  const nextFieldsIds = nextFields
    .filter(f => f.attribute.id)
    .map(f => f.attribute.id)

  // For adding all removed multiField attributes
  previousFields.forEach(previousField => {
    if (!nextFieldsIds.includes(previousField.id)) {
      deletedAttributesList.push(previousField.id)
    }
  })

  nextFields.forEach(nextField => {
    const { attribute, value, label } = nextField

    if (!attribute) {
      throw new Error(
        // eslint-disable-next-line
        `Field {value} has not an attribute. All fields must to reference to an attribute.`
      )
    }

    let previousValue
    let previousLabel
    const selectInitialValue = '-Select-'
    const { attribute_def } = attribute
    const type = attribute_def.data_type
    const previousAttribute = previousFieldsIndexedById[attribute.id]

    if (previousAttribute) {
      previousValue = previousAttribute[type]
      previousLabel = previousAttribute.label
    }

    let newValue =
      typeof value === 'string'
        ? getParser(attribute)(value)
        : getParser(attribute)(value.value)

    previousValue = previousValue == null ? '' : previousValue

    if (newValue === previousValue) {
      newValue = undefined
    }

    if (attribute.id) {
      if (
        value &&
        label &&
        attribute_def.has_label &&
        label.value !== previousLabel
      ) {
        upsertedAttributeList.push({
          id: attribute.id,
          [type]: getParser(attribute)(value),
          label: label && label.value
        })
      } else if (attribute_def.enum_values && newValue) {
        if (newValue === selectInitialValue) {
          deletedAttributesList.push(attribute.id)
        } else {
          upsertedAttributeList.push({
            id: attribute.id,
            [type]: newValue
          })
        }
      } else if (newValue || newValue !== previousValue) {
        upsertedAttributeList.push({
          id: attribute.id,
          [type]: newValue
        })
      }
    } else if (newValue && newValue !== selectInitialValue) {
      if (attribute_def.has_label) {
        upsertedAttributeList.push({
          attribute_def,
          [type]: newValue,
          label:
            label && label.value
              ? label.value === selectInitialValue
                ? attribute_def.labels[0]
                : label.value
              : attribute_def.labels[0]
        })
      } else {
        upsertedAttributeList.push({
          attribute_def,
          [type]: newValue
        })
      }
    }
  })

  // for parsing number fields
  upsertedAttributeList = upsertedAttributeList.map(attribute => {
    if (attribute.number != null) {
      const number = parseFloat(attribute.number)

      if (isNumeric(number)) {
        return {
          ...attribute,
          number
        }
      }

      return {
        ...attribute,
        number: null
      }
    }

    return attribute
  })

  return {
    upsertedAttributeList,
    deletedAttributesList
  }
}
