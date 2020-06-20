export function submitValidate(values) {
  const isEmptyTextField = fieldName =>
    !values[fieldName] || !values[fieldName].trim()
  const isEmptyFieldArray = fields =>
    fields.every(field => !field.text || !field.text.trim())

  if (
    isEmptyTextField('first_name') &&
    isEmptyTextField('middle_name') &&
    isEmptyTextField('last_name') &&
    isEmptyTextField('source') &&
    isEmptyFieldArray(values.email) &&
    isEmptyFieldArray(values.phone_number)
  ) {
    return 'Please fill in any of the contacts profile fields to add your contact.'
  }

  return ''
}
