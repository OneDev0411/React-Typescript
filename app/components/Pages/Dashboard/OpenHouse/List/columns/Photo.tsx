import React from 'react'
import { Avatar } from '@material-ui/core'

interface Props {
  listings: ICRMTaskAssociation<CRMTaskAssociationType>[]
}

export default function Photo({ listings }: Props) {
  const avatar = listings[0].listing.gallery_image_urls[0]

  return <Avatar alt="" src={avatar} />
}
