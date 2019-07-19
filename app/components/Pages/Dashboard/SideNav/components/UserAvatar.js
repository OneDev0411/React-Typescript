// ProfileImage.js
import React from 'react'

import { Avatar } from '../styled'

const getNameInitials = user => {
  let initials = ''
  const { first_name, last_name } = user

  if (first_name) {
    initials = first_name.charAt(0).toUpperCase()
  }

  if (last_name) {
    initials += last_name.charAt(0).toUpperCase()
  }

  return initials
}

const UserAvatar = ({ user, size = 48 }) => {
  const { profile_image_url } = user
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    lineHeight: `${size}px`
  }

  let avatar = getNameInitials(user)

  if (profile_image_url) {
    style.background = 'transparent'

    avatar = (
      <img
        alt="rechat avatar"
        style={{ verticalAlign: 'top' }}
        src={profile_image_url}
      />
    )
  }

  return <Avatar style={style}>{avatar}</Avatar>
}

export default UserAvatar
