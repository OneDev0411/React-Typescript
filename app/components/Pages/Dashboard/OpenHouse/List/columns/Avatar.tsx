import React from 'react'

import { mdiHomeOutline } from '@mdi/js'

import { Avatar } from 'components/Avatar'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  listings: ICRMTaskAssociation<CRMTaskAssociationType>[]
}

export default function Photo({ listings }: Props) {
  const avatar = listings?.[0]?.listing?.cover_image_url

  return (
    <Avatar url={avatar ?? ''}>
      <SvgIcon path={mdiHomeOutline} />
    </Avatar>
  )
}
