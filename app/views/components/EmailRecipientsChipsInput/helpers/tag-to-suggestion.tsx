import { Avatar } from '@material-ui/core'

import React from 'react'
import { mdiTagOutline } from '@mdi/js'

import { SvgIcon } from '../../SvgIcons/SvgIcon'

export function tagToSuggestion(
  recipient: IDenormalizedEmailRecipientTagInput
) {
  return {
    title: recipient.tag.text,
    subtitle: 'Tag',
    avatar: (
      <Avatar>
        <SvgIcon path={mdiTagOutline} />
      </Avatar>
    ),
    data: recipient
  }
}
