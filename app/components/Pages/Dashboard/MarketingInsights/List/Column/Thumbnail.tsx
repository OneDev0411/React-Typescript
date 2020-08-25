import React from 'react'
import { mdiEmailOutline } from '@mdi/js'

import { Avatar } from 'components/GeneralAvatar'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  data: IEmailCampaign
}

function ThumbnailColumn({ data }: Props) {
  return (
    <Avatar email={data} size="large">
      <SvgIcon path={mdiEmailOutline} />
    </Avatar>
  )
}

export default ThumbnailColumn
