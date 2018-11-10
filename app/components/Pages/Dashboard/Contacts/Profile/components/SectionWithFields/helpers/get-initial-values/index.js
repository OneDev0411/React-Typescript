import { months } from 'utils/date-times'

const SELECT_FIELD_DEFAULT_VALUE = {
  title: '-Select-',
  value: '-Select-'
}

export function getInitialValues(attributes) {
  const initialValues = {}

  attributes.forEach(attribute => {
    const { attribute_def } = attribute
    const { id, data_type, singular, labels } = attribute_def

    const value = attribute[data_type]
    const isDateType = data_type === 'date'
    const isSelectField = singular && attribute_def.enum_values

    const arrayFieldValue = value => {
      if (attribute_def.enum_values) {
        return value ? { title: value, value } : SELECT_FIELD_DEFAULT_VALUE
      }

      return value || ''
    }

    const getDateFieldsValue = date => {
      if (!date) {
        return {
          day: { title: 'Day', value: null },
          month: { title: 'Month', value: null },
          year: null
        }
      }

      const _date = new Date(date * 1000)
      const day = _date.getDay()
      const month = _date.getMonth()

      return {
        day: { title: day, value: day },
        month: { title: months[month - 1], value: month },
        year: _date.getFullYear()
      }
    }

    const getMultiField = () => {
      let newField = { attribute }

      if (isDateType) {
        newField = {
          ...newField,
          ...getDateFieldsValue(value)
        }
      } else {
        newField = {
          ...newField,
          value: arrayFieldValue(value)
        }
      }

      if (labels) {
        newField = {
          ...newField,
          label: value
            ? attribute.label == null
              ? SELECT_FIELD_DEFAULT_VALUE
              : {
                  title: attribute.label,
                  value: attribute.label
                }
            : SELECT_FIELD_DEFAULT_VALUE
        }
      }

      return newField
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
      } else if (!singular) {
        const newField = getMultiField()

        if (Array.isArray(initialValues[id])) {
          initialValues[id] = [...initialValues[id], newField]
        } else {
          initialValues[id] = [newField]
        }
      } else if (isDateType) {
        initialValues[id] = {
          attribute,
          ...getDateFieldsValue(value)
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
    } else if (!singular) {
      initialValues[id] = [getMultiField()]
    } else if (isDateType) {
      initialValues[id] = {
        attribute,
        ...getDateFieldsValue()
      }
    } else {
      initialValues[id] = { attribute, value: '' }
    }
  })

  return initialValues
}
