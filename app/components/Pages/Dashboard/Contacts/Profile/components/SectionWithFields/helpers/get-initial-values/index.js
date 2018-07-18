import { getFormater } from '../get-formater'

const SELECT_FIELD_DEFAULT_VALUE = {
  title: '-Select-',
  value: '-Select-'
}

export function getInitialValues(attributes) {
  const initialValues = {}

  attributes.forEach(attribute => {
    const { attribute_def } = attribute
    const { id, data_type, singular, labels } = attribute_def

    const isSelectField = singular && attribute_def.enum_values
    const isMultiFields = !singular && labels
    const isMultiFieldsWithoutLabels = !singular && !labels

    const value = getFormater(attribute)(attribute[data_type])

    const arrayFieldValue = value => {
      if (attribute_def.enum_values) {
        return value ? { title: value, value } : SELECT_FIELD_DEFAULT_VALUE
      }

      return value || ''
    }

    if (value) {
      if (isSelectField) {
        initialValues[id] = {
          attribute,
          value: {
            value,
            title: value
          }
        }
      } else if (isMultiFields) {
        const newField = {
          attribute,
          label: {
            title: attribute.label,
            value: attribute.label
          },
          value: arrayFieldValue(value)
        }

        if (Array.isArray(initialValues[id])) {
          initialValues[id] = [...initialValues[id], newField]
        } else {
          initialValues[id] = [newField]
        }
      } else if (isMultiFieldsWithoutLabels) {
        const newField = { attribute, value: arrayFieldValue(value) }

        if (Array.isArray(initialValues[id])) {
          initialValues[id] = [...initialValues[id], newField]
        } else {
          initialValues[id] = [newField]
        }
      } else {
        initialValues[id] = { attribute, value }
      }

      return initialValues
    }

    if (isSelectField) {
      initialValues[id] = {
        attribute,
        value: SELECT_FIELD_DEFAULT_VALUE
      }
    } else if (isMultiFields) {
      initialValues[id] = [
        {
          attribute,
          label: SELECT_FIELD_DEFAULT_VALUE,
          value: arrayFieldValue()
        }
      ]
    } else if (isMultiFieldsWithoutLabels) {
      initialValues[id] = [
        {
          attribute,
          value: arrayFieldValue()
        }
      ]
    } else {
      initialValues[id] = { attribute, value: '' }
    }
  })

  return initialValues
}
