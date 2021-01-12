import { getItems } from 'models/Deal/helpers/dynamic-context'
import { getActiveTeamId } from 'utils/user-teams'

export function getDealContexts(
  user: IUser,
  dealType?: IDealType,
  dealPropertyType?: IDealPropertyType
): IDealBrandContext[] {
  if (!dealType || !dealPropertyType) {
    return []
  }

  const id = getActiveTeamId(user)

  return getItems(id, dealType, dealPropertyType).filter(
    (field: IDealBrandContext) => {
      if (!field.mandatory) {
        return false
      }

      if (['contract_status', 'listing_status'].includes(field.key)) {
        return false
      }

      return true
    }
  )
}
