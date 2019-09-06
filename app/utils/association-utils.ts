export const toEntityAssociation = (entityType: string) => (
  association: string
) => `${entityType}.${association}`
