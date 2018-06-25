export function getInitialValues(attributes) {
  const initialValues = {}

  attributes.forEach(attribute => {
    const { attribute_def } = attribute
    const { name, data_type, singular, labels } = attribute_def

    const isSelectField = singular && attribute_def.enum_values
    const isMultiFields = !singular && labels
    const isMultiFieldsWithoutLabels = !singular && !labels

    const value = attribute[data_type]

    if (value) {
      if (isSelectField) {
        initialValues[name] = {
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

        if (Array.isArray(initialValues[name])) {
          initialValues[name] = [...initialValues[name], newField]
        } else {
          initialValues[name] = [newField]
        }
      } else if (isMultiFieldsWithoutLabels) {
        const newField = { attribute, value }

        if (Array.isArray(initialValues[name])) {
          initialValues[name] = [...initialValues[name], newField]
        } else {
          initialValues[name] = [newField]
        }
      } else {
        initialValues[name] = { attribute, value }
      }

      return initialValues
    }

    if (isSelectField) {
      initialValues[name] = {
        attribute,
        value: {
          title: '-Select-',
          value: '-Select-'
        }
      }
    } else if (isMultiFields) {
      initialValues[name] = [
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
      initialValues[name] = [{ attribute, value: '' }]
    } else {
      initialValues[name] = { attribute, value: '' }
    }
  })

  return initialValues
}
