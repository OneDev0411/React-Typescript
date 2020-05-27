/**
 * Check for having contact association for showing send notification modal
 * @param {IEvent} event the event object
 * @returns {boolean}
 */
export function hasContactAssociation(event: IEvent): boolean {
  if (!event || !event.associations) {
    return false
  }

  const contactAssociationsCount = event.associations.filter(
    i => i.association_type === 'contact'
  ).length

  return contactAssociationsCount > 0
}
