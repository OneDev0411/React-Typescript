import { Avatar } from '@material-ui/core'

import React from 'react'

import ListIcon from '../../SvgIcons/List/ListIcon'

export function listToSuggestion(list: IContactList) {
  return {
    title: list.name,
    subtitle: 'List',
    avatar: (
      <Avatar>
        <ListIcon color="currentColor" />
      </Avatar>
    ),
    data: list
  }
}
