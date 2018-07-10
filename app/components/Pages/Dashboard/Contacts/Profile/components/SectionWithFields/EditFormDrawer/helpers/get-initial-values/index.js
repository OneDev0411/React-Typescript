import { getFormater } from '../../../helpers/get-formater'

export function getInitialValues(attributes) {
  const initialValues = {}

  attributes.forEach(attribute => {
    const { attribute_def } = attribute
    const { id, data_type, singular, labels } = attribute_def

    const isSelectField = singular && attribute_def.enum_values
    const isMultiFields = !singular && labels
    const isMultiFieldsWithoutLabels = !singular && !labels

    const value = getFormater(attribute)(attribute[data_type])

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
          value
        }

        if (Array.isArray(initialValues[id])) {
          initialValues[id] = [...initialValues[id], newField]
        } else {
          initialValues[id] = [newField]
        }
      } else if (isMultiFieldsWithoutLabels) {
        const newField = { attribute, value }

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
        value: {
          title: '-Select-',
          value: '-Select-'
        }
      }
    } else if (isMultiFields) {
      initialValues[id] = [
        {
          attribute,
          label: {
            title: '-Select-',
            value: '-Select-'
          },
          value: ''
        }
      ]
    } else if (isMultiFieldsWithoutLabels) {
      initialValues[id] = [{ attribute, value: '' }]
    } else {
      initialValues[id] = { attribute, value: '' }
    }
  })

  return initialValues
}
