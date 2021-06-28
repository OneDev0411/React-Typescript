import { useSelector } from 'react-redux'

import { selectDealsList } from '@app/selectors/deals'
import LinkButton, { LinkButtonProps } from '@app/views/components/LinkButton'

interface ListingsListColumnActionsDealButtonProps
  extends Omit<LinkButtonProps, 'to' | 'children'> {
  listingId: UUID
}

function ListingsListColumnActionsDealButton({
  listingId,
  disabled,
  ...otherProps
}: ListingsListColumnActionsDealButtonProps) {
  const deals = useSelector(selectDealsList)

  const dealList: IDeal[] = Object.values(deals ?? {})
  const deal = dealList.find(deal => deal.listing === listingId)

  return (
    <LinkButton
      {...otherProps}
      to={
        deal
          ? `/dashboard/deals/${deal.id}`
          : `/dashboard/deals/create?listingId=${listingId}`
      }
      disabled={disabled || !deals}
    >
      {deal ? 'View' : 'Create'} Deal
    </LinkButton>
  )
}

export default ListingsListColumnActionsDealButton
