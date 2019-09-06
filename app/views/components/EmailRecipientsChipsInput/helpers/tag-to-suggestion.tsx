import { Avatar } from '@material-ui/core'

import React from 'react'

import TagIcon from '../../SvgIcons/Tag/TagIcon'

export function tagToSuggestion(
  recipient: IDenormalizedEmailRecipientTagInput
) {
  return {
    title: recipient.tag.text,
    subtitle: 'Tag',
    avatar: (
      <Avatar>
        <TagIcon />
      </Avatar>
    ),
    data: recipient
  }
}
