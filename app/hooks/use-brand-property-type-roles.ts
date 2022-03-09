import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { useBrandPropertyTypes } from '@app/hooks/use-get-brand-property-types'

export function useBrandPropertyTypeRoles(propertyType?: IDealPropertyTypes) {
  const activeBrandId = useActiveBrandId()

  const { propertyTypes } = useBrandPropertyTypes(activeBrandId)

  const propertyTypeItem = propertyTypes.find(
    ({ label }) => label === propertyType
  )

  return {
    roles: [
      ...(propertyTypeItem?.required_roles || []),
      ...(propertyTypeItem?.optional_roles || [])
    ],
    requiredRoles: propertyTypeItem?.required_roles || [],
    optionalRoles: propertyTypeItem?.optional_roles || []
  }
}
