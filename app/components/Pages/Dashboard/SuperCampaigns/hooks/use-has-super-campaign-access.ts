import { useSelector } from 'react-redux'

import { ACL } from '@app/constants/acl'
import { selectUserType } from '@app/selectors/user'
import { useAcl } from '@app/views/components/Acl/use-acl'

export function useHasSuperCampaignAccess(): boolean {
  const isAdmin = useAcl(ACL.ADMIN)
  const isAgent = useSelector(selectUserType) === 'Agent'

  const hasBetaAccess = useAcl(ACL.BETA)

  // Put this feature behind Beta flag
  if (!hasBetaAccess) {
    return false
  }

  // We should display this feature only for Admins and Agents
  return isAdmin || isAgent
}
