import React from 'react'

import { Avatar } from '@material-ui/core'
import { mdiFormatListBulleted } from '@mdi/js'

import { Suggestion } from '../../ChipsInput/types'
import { SvgIcon } from '../../SvgIcons/SvgIcon'

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
