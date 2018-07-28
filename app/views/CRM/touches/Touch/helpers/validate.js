/**
 * Fields validator
 * @param {object} values The form values
 * @returns {object} invalid fields
 */
export function validate(values) {
  const errors = {}
  const requiredError = 'Required'
  const timeRequiredError = 'Time is required,'

  if (values.activity_type.value === '-Select-') {
    errors.activity_type = requiredError
  }

  if (values.touchTime.value == null) {
    errors.touchTime = timeRequiredError
  }

  return errors
}
