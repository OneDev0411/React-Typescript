// ProfileImage.js
import React from 'react'

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

const Avatar = ({ user, size = 48 }) => {
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
        src={profile_image_url}
        className="c-avatar__image"
      />
    )
  }

  return (
    <div className="c-avatar" style={style}>
      {avatar}
    </div>
  )
}

export default Avatar
