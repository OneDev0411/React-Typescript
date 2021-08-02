import { ButtonProps } from '@material-ui/core'

import LinkButton from '@app/views/components/LinkButton'

interface ListingsListColumnActionsMarketListingButtonProps
  extends Omit<ButtonProps, 'onClick' | 'children'> {
  listingId: UUID
}

function ListingsListColumnActionsMarketListingButton({
  listingId,
  ...otherProps
}: ListingsListColumnActionsMarketListingButtonProps) {
  return (
    <LinkButton
      {...otherProps}
      to={`/dashboard/marketing/mls/${listingId}`}
      target="_blank"
    >
      Market Listing
    </LinkButton>
  )
}

export default ListingsListColumnActionsMarketListingButton
