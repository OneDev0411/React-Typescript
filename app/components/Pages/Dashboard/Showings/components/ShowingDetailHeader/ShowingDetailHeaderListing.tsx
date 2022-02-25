import { mdiOpenInNew } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import LinkButton from '../LinkButton'

interface ShowingDetailHeaderListingProps {
  listing: IListing
}

function ShowingDetailHeaderListing({
  listing
}: ShowingDetailHeaderListingProps) {
  return (
    <LinkButton
      color="secondary"
      size="medium"
      variant="text"
      endIcon={<SvgIcon path={mdiOpenInNew} size={muiIconSizes.small} />}
      to={`/dashboard/mls/${listing.id}`}
      target="_blank"
    >
      MLS# {listing.mls_number}
    </LinkButton>
  )
}

export default ShowingDetailHeaderListing
