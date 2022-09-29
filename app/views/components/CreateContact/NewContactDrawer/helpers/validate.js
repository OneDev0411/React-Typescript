export function submitValidate(values) {
  const DaysOfYear = 365
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

  if (Number(values.touch_freq) > DaysOfYear) {
    return "The duration of a manage relationship can't be more than 365 days"
  }

  if (Number(values.touch_freq) < 1) {
    return "The duration of a manage relationship can't be less than 1 days"
  }

  if (typeof values.touch_freq != 'number') {
    return 'The duration of a manage relationship must be a number'
  }

  return ''
}
