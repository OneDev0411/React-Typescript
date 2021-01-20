/**
 * return the trigger's subject
 * @param {TriggerContactEventTypes} attributeName - all attributes definitions
 */

export const getTriggerSubject = (
  attributeName: TriggerContactEventTypes
): string => {
  // birthday attribute
  if (['birthday', 'child_birthday'].includes(attributeName)) {
    return 'Happy Birthday!'
  }

  // anniversary attribute
  if (['wedding_anniversary', 'home_anniversary'].includes(attributeName)) {
    return 'Happy Anniversary!'
  }

  return 'Congratulation!'
}
