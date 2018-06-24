export function getInitialValues(fields) {
  const initialValues = {}

  fields.forEach(field => {
    const { attribute_def } = field
    const { name, data_type, singular, labels } = attribute_def

    const isSelectField = singular && attribute_def.enum_values
    const isMultiFields = !singular && labels
    const isMultiFieldsWithoutLabels = !singular && !labels

    const value = field[data_type]

    if (value) {
      if (isSelectField) {
        initialValues[name] = {
          value,
          title: value
        }
      } else if (isMultiFields) {
        const newField = {
          label: {
            title: field.label,
            value: field.label
          },
          text: value
        }

        if (Array.isArray(initialValues[name])) {
          initialValues[name] = [...initialValues[name], newField]
        } else {
          initialValues[name] = [newField]
        }
      } else if (isMultiFieldsWithoutLabels) {
        const newField = { text: value }

        if (Array.isArray(initialValues[name])) {
          initialValues[name] = [...initialValues[name], newField]
        } else {
          initialValues[name] = [newField]
        }
      } else {
        initialValues[name] = value
      }

      return initialValues
    }

    if (isSelectField) {
      initialValues[name] = {
        title: '-Select-',
        value: '-Select-'
      }
    } else if (isMultiFields) {
      initialValues[name] = [
        {
          label: {
            title: '-Select-',
            value: '-Select-'
          },
          text: ''
        }
      ]
    } else if (isMultiFieldsWithoutLabels) {
      initialValues[name] = [{ text: '' }]
    } else {
      initialValues[name] = ''
    }
  })

  return initialValues
}
