import React from 'react'
import { Typography } from '@material-ui/core'

import { Avatar } from 'components/Avatar'

import { TextWithHighlights } from 'components/TextWithHighlights'

import { ItemContainer, ItemDetailsContainer } from './styled'

interface Props {
  user: IUser
}

export default function Member({ user }: Props) {
  return (
    <ItemContainer>
      <ItemDetailsContainer>
        <Avatar user={user} alt={user.display_name} />
      </ItemDetailsContainer>
      <ItemDetailsContainer>
        <Typography variant="body1">
          <TextWithHighlights>{user.display_name}</TextWithHighlights>
        </Typography>
        <Typography variant="body2">
          <TextWithHighlights>{user.email}</TextWithHighlights>
        </Typography>
      </ItemDetailsContainer>
    </ItemContainer>
  )
}
