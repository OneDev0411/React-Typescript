/**
 * Generate CRM log associations objects
 * @param {String} association_type The type of associtaions
 * @param {Array} associations Associations id
 * @return {Array} The Rechat CRM event associations
 */
export function getCRMLogAssociations(association_type, associations) {
  return associations.map(id => ({
    association_type,
    [association_type]: id
  }))
}
