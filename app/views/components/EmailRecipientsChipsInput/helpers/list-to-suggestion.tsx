import { Avatar } from '@material-ui/core'

import React from 'react'
import { mdiFormatListBulleted } from '@mdi/js'

import { SvgIcon } from '../../SvgIcons/SvgIcon'
import { Suggestion } from '../../ChipsInput/types'

export function listToSuggestion(
  recipient: IDenormalizedEmailRecipientListInput
): Suggestion {
  return {
    title: recipient.list.name,
    subtitle: 'List',
    avatar: (
      <Avatar>
        <SvgIcon path={mdiFormatListBulleted} />
      </Avatar>
    )
  }
}
