export function validate(values) {
  const errors = {}

  if (!values.label) {
    errors.label = 'Required'
  }

  if (values.data_type.value === '-Select-') {
    errors.data_type = 'Required'
  }

  if (values.section.value === '-Select-') {
    errors.section = 'Required'
  }

  return errors
}
