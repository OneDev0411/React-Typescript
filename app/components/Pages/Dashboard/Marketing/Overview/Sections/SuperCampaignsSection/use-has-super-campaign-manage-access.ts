import { useSelector } from 'react-redux'

import { ACL } from '@app/constants/acl'
import { selectActiveBrandId } from '@app/selectors/brand'
import { useAcl } from '@app/views/components/Acl/use-acl'

export function useHasSuperCampaignManageAccess(
  superCampaign: ISuperCampaign<'template_instance' | 'created_by'>
): boolean {
  const activeBrandId = useSelector(selectActiveBrandId)
  const isAdmin = useAcl(ACL.ADMIN)

  return isAdmin && superCampaign.brand === activeBrandId
}
