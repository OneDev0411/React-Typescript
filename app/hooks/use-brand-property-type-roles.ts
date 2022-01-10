import { useSelector } from 'react-redux'

import { selectUser } from '@app/selectors/user'
import { useBrandPropertyTypes } from 'hooks/use-get-brand-property-types'
import { getActiveTeamId } from 'utils/user-teams'

export function useBrandPropertyTypeRoles(propertyType?: IDealPropertyTypes) {
  const user = useSelector(selectUser)
  const activeTeamId = getActiveTeamId(user)
  const { propertyTypes } = useBrandPropertyTypes(activeTeamId)

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
