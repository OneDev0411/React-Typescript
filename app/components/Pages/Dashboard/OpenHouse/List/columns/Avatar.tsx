import React from 'react'

import { mdiHomeOutline } from '@mdi/js'

import { Avatar } from 'components/Avatar'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  listings: ICRMTaskAssociation<CRMTaskAssociationType>[]
}

export default function Photo({ listings }: Props) {
  const avatar = listings[0] ? listings[0].listing.gallery_image_urls[0] : null

  return (
    <Avatar url={avatar}>
      <SvgIcon path={mdiHomeOutline} />
    </Avatar>
  )
}
