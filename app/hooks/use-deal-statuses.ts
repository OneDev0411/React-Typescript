import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { getBrandChecklistStatuses } from 'reducers/deals/brand-checklists'

export function useDealStatuses(
  deal: IDeal | null,
  propertyType?: IBrandChecklist['checklist_type']
) {
  return useSelector<IAppState, IBrandChecklist['statuses']>(({ deals }) =>
    deal
      ? getBrandChecklistStatuses(
          deals.brandChecklists,
          deal.brand.id,
          deal.property_type?.id,
          propertyType || (deal.has_active_offer ? 'Offer' : deal.deal_type)
        )
      : []
  )
}
