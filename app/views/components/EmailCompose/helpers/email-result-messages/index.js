/**
 * Returns error and success message for sending email based on
 * being number of recipient and immediate/scheduled sending
 * @param {number} numRecipient
 * @param {boolean} scheduled
 * @returns {{errorMessage: string, successMessage: string}}
 */
export function getSendEmailResultMessages(numRecipient, scheduled) {
  const pastTenseVerb = scheduled ? 'scheduled' : 'sent'
  const successMessage =
    numRecipient > 1
      ? `${numRecipient} emails have been ${pastTenseVerb}`
      : `The email has been ${pastTenseVerb}`
  const errorMessage = `Could not ${
    scheduled ? 'schedule' : 'send'
  } the email. try again.`

  return {
    successMessage,
    errorMessage
  }
}
