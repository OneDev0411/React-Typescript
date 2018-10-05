import React from 'react'
import Avatar from 'components/Avatar'

import Deal from 'models/Deal'

export function ListingImage({ deal }) {
  const imageUrl = Deal.get.field(deal, 'photo')
  const placeholderImageUrl = '/static/images/deals/group-146.svg'

  return (
    <Avatar
      size={72}
      image={imageUrl || placeholderImageUrl}
      title={deal.title}
      placeHolderImage=""
      statusColor="#35b863"
      isOnline
      showStatus
    />
  )
}
