export function textForSubmitButton({ isSubmitting, isDateSet }) {
  if (isSubmitting) {
    return isDateSet ? 'Saving...' : 'Sending...'
  }

  if (isDateSet) {
    return 'Save'
  }

  return 'Send'
}
