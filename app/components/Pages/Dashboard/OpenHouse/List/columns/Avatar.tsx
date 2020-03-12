import React from 'react'
import { Avatar } from '@material-ui/core'

import IconHome from 'components/SvgIcons/Home/HomeIcon'

interface Props {
  listings: ICRMTaskAssociation<CRMTaskAssociationType>[]
}

export default function Photo({ listings }: Props) {
  if (!listings[0]) {
    return (
      <Avatar>
        <IconHome />
      </Avatar>
    )
  }

  const avatar = listings[0].listing.gallery_image_urls[0]

  return <Avatar alt="" src={avatar} />
}
