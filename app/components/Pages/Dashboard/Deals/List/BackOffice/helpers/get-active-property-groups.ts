import { TPropertyGroupType } from '../types'

//
export const getActivePropertyGroups = (
  selectedPropertyTypes: UUID[],
  propertyTypes: IDealPropertyType[]
): TPropertyGroupType[] => {
  const selectedTypes = new Set<UUID>(selectedPropertyTypes)
  const activeGroups = new Set<TPropertyGroupType>()

  propertyTypes.forEach(propertyType => {
    if (selectedTypes.has(propertyType.id)) {
      activeGroups.add(propertyType.is_lease ? 'lease' : 'sale')
    }
  })

  return Array.from(activeGroups)
}
