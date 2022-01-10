/**
 * generate attribute name
 * @param {TriggerContactEventTypes} eventType - the type we want to create/edit trigger
 */
export const getAttributeName = (
  eventType: TriggerContactEventTypes
): string => {
  return eventType
    .split('_')
    .map(text => text.replace(/^\w/, c => c.toUpperCase()))
    .join(' ')
}
