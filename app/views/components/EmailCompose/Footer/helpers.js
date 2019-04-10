
function textForSubmitButton({ isSubmitting, isDateSet }) {
  if (isSubmitting) {
    return 'Sending...'
  }

  if (isDateSet) {
    return 'Save'
  }

  return 'Send'
}

export {textForSubmitButton}