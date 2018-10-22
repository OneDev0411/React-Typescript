import React from 'react'
import Avatar from 'components/Avatar'

import Deal from 'models/Deal'
import { getStatusColor } from 'utils/listing'

export function ListingImage({ deal }) {
  const imageUrl = Deal.get.field(deal, 'photo')
  const status = Deal.get.status(deal)
  const placeholderImageUrl = '/static/images/deals/group-146.svg'

  return (
    <Avatar
      size={72}
      image={imageUrl || placeholderImageUrl}
      title={deal.title}
      placeHolderImage=""
      statusColor={`#${getStatusColor(status)}`}
      isOnline
      showStatus
    />
  )
}
