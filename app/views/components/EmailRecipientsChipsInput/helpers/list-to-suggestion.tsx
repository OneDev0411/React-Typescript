import { Avatar } from '@material-ui/core'

import React from 'react'

import ListIcon from '../../SvgIcons/List/ListIcon'
import { Suggestion } from '../../ChipsInput/types'

export function listToSuggestion(
  recipient: IDenormalizedEmailRecipientListInput
): Suggestion {
  return {
    title: recipient.list.name,
    subtitle: 'List',
    AvatarComponent: (
      <Avatar>
        <ListIcon color="currentColor" />
      </Avatar>
    )
  }
}
