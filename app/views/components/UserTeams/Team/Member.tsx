import React from 'react'
import { Typography } from '@material-ui/core'

import Avatar from 'components/Avatar'

import { ItemContainer, ItemDetailsContainer } from './styled'

interface Props {
  user: IUser
}

export default function Member({ user }: Props) {
  return (
    <ItemContainer>
      <ItemDetailsContainer>
        <Avatar image={user.profile_image_url} title={user.display_name} />
      </ItemDetailsContainer>
      <ItemDetailsContainer>
        <Typography variant="body1">{user.display_name}</Typography>
        <Typography variant="body2">{user.email}</Typography>
      </ItemDetailsContainer>
    </ItemContainer>
  )
}
