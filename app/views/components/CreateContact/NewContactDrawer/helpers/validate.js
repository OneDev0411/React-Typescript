const DaysOfYear = 365
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

  if (
    values.touch_freq !== '' &&
    (Number.isNaN(Number(values.touch_freq)) ||
      Number(values.touch_freq) > DaysOfYear ||
      Number(values.touch_freq) < 1)
  ) {
    return 'Manage Relationship should have a valid duration between 1 and 365 days'
  }

  return ''
}
