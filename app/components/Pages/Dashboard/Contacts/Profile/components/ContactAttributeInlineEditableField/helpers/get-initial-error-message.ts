/**
 * return the initial error for edit attr
 * @param {IContact} contact - the contact
 * @param {boolean} isTriggerable - is the attr triggerable or not
 */

export function getInitialErrorMessage(
  contact: IContact,
  isTriggerable: boolean
): string {
  let error = ''

  if (!contact.email && isTriggerable) {
    error =
      "You should provide contact's email to be able to use trigger feature."
  }

  if (!contact.user && isTriggerable) {
    error =
      "You should set an contact's owner to be able to use trigger feature."
  }

  return error
}
