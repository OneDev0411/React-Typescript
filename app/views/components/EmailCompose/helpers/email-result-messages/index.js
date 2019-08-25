/**
 * Returns error and success message for sending email based on
 * being number of recipient and immediate/scheduled sending
 * @param {boolean} scheduled
 * @returns {{errorMessage: string, successMessage: string}}
 */
export function getSendEmailResultMessages(scheduled) {
  const pastTenseVerb = scheduled ? 'scheduled' : 'sent'

  // We also have tag and list, so showing numRecipient doesn't make sens
  // for those cases. Related issue https://gitlab.com/rechat/web/issues/3067
  // I disabled it for now.
  // const successMessage =
  //   numRecipient > 1
  //     ? `${numRecipient} emails have been ${pastTenseVerb}`
  //     : `The email has been ${pastTenseVerb}`

  const successMessage = `The email has been ${pastTenseVerb}`
  const errorMessage = `Could not ${
    scheduled ? 'schedule' : 'send'
  } the email. try again.`

  return {
    successMessage,
    errorMessage
  }
}
