import React from 'react'

import { borderColor } from 'views/utils/colors'
import { getUserInitials } from 'models/user/helpers/get-user-initials'
import AvatarImage from 'components/Avatar'

const Avatar = props => (
  <AvatarImage
    {...props}
    image={props.user.profile_image_url}
    initials={getUserInitials(props.user)}
    backgroundColor={borderColor}
  />
)

Avatar.defaultProps = {
  size: 104
}

export default Avatar
