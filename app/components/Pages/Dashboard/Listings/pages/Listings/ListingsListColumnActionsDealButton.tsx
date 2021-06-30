import LinkButton, { LinkButtonProps } from '@app/views/components/LinkButton'

import useListingsFindDealId from './use-listings-find-deal-id'

interface ListingsListColumnActionsDealButtonProps
  extends Omit<LinkButtonProps, 'to' | 'children'> {
  listingId: UUID
}

function ListingsListColumnActionsDealButton({
  listingId,
  disabled,
  ...otherProps
}: ListingsListColumnActionsDealButtonProps) {
  const dealId = useListingsFindDealId(listingId)

  return (
    <LinkButton
      {...otherProps}
      to={
        dealId
          ? `/dashboard/deals/${dealId}`
          : `/dashboard/deals/create?listingId=${listingId}`
      }
      disabled={disabled}
    >
      {dealId ? 'View' : 'Create'} Deal
    </LinkButton>
  )
}

export default ListingsListColumnActionsDealButton
