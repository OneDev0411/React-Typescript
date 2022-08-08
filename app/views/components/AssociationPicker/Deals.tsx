import { MenuItem } from '@material-ui/core'

import {
  getField,
  getFormattedPrice,
  getPrice,
  getStatus
} from '@app/models/Deal/helpers/context'

import { LoadingSkeleton } from './LoadingSkeleton'
import { NotFound } from './NotFound'
import { useDealsList } from './queries/use-deals-list'
import { useInitialDeals } from './queries/use-initial-deals'
import { RowItem } from './RowItem'
import { SectionTitle } from './SectionTitle'

interface Props {
  criteria: string
  onSelect: (deal: IDeal) => void
}

export function Deals({ criteria, onSelect }: Props) {
  const { data: deals, isLoading: isFetchingDeals } = useDealsList(criteria)
  const { data: initialDeals, isLoading: isLoadingInitialDeal } =
    useInitialDeals()

  const list = !isFetchingDeals && deals?.length ? deals : initialDeals

  return (
    <div>
      <SectionTitle text="Deals" />

      {!isFetchingDeals &&
        list?.map(deal => (
          <MenuItem key={deal.id} onClick={() => onSelect(deal)}>
            <RowItem
              avatarUrl={getField(deal, 'photo')}
              title={deal.title}
              subtitle={`${deal.deal_type}, ${getFormattedPrice(
                getPrice(deal)
              )}`}
              status={getStatus(deal)}
              mlsName={null}
            />
          </MenuItem>
        ))}

      {(isFetchingDeals || isLoadingInitialDeal) && <LoadingSkeleton />}
      {!isFetchingDeals && !isLoadingInitialDeal && !list?.length && (
        <NotFound />
      )}
    </div>
  )
}
