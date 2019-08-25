import { Avatar } from '@material-ui/core'

import React from 'react'

import TagIcon from '../../SvgIcons/Tag/TagIcon'

export function tagToSuggestion(tag: IContactTag) {
  return {
    title: tag.text,
    subtitle: 'Tag',
    avatar: (
      <Avatar>
        <TagIcon />
      </Avatar>
    ),
    data: tag
  }
}
