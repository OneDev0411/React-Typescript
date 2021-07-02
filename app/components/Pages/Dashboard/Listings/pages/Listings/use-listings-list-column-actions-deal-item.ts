import { ACL } from '@app/constants/acl'
import { goTo } from '@app/utils/go-to'
import { useAcl } from '@app/views/components/Acl/use-acl'

import useListingsFindDealId from './use-listings-find-deal-id'

const dealsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE] }

// interface UseListingsListColumnActionsDealItemReturn {

// }

function useListingsListColumnActionsDealItem(
  listingId: UUID,
  hasActions: boolean
) {
  const hasDealsAccess = useAcl(dealsAccess)
  const dealId = useListingsFindDealId(listingId)

  const gotoDeal = () =>
    goTo(
      dealId
        ? `/dashboard/deals/${dealId}`
        : `/dashboard/deals/create?listingId=${listingId}`
    )

  const dealLabel = [dealId ? 'View' : 'Create', 'Deal'].join(' ')
  const hasDealButton = hasDealsAccess && hasActions

  return {
    gotoDeal,
    dealLabel,
    hasDealButton
  }
}

export default useListingsListColumnActionsDealItem
