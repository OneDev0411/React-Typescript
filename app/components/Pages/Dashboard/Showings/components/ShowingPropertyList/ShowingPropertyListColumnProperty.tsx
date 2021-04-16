import { Box, Typography } from '@material-ui/core'

import { Avatar } from 'components/Avatar'
import { getField } from 'models/Deal/helpers/context'

import Deal from 'models/Deal'

type ShowingPropertyListColumnPropertyProps = Pick<
  IShowing,
  'deal' | 'listing' | 'address'
>

function ShowingPropertyListColumnProperty({
  deal,
  listing,
  address
}: ShowingPropertyListColumnPropertyProps) {
  const placeholderImageUrl = '/static/images/deals/group-146.svg'

  return (
    <Box display="flex" alignItems="center">
      <Box flexShrink="0" flexGrow="0" mr={2}>
        <Avatar
          url={
            Deal.get.field(deal, 'photo') ||
            (listing?.gallery_image_urls?.length &&
              listing?.gallery_image_urls[0]) ||
            placeholderImageUrl
          }
          variant="circular"
        />
      </Box>
      <Typography noWrap variant="body2">
        {getField(deal, 'full_address') ||
          deal?.title ||
          listing?.property.address.street_address ||
          address?.full}
      </Typography>
    </Box>
  )
}

export default ShowingPropertyListColumnProperty
