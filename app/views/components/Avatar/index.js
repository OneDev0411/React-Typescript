import React from 'react'
import PropTypes from 'prop-types'

const getNameInitials = user => {
  let initials
  const { first_name, last_name, display_name } = user

  if (first_name) {
    initials = first_name.charAt(0).toUpperCase()
  }

  if (last_name) {
    initials += last_name.charAt(0).toUpperCase()
  }

  if (!initials && display_name) {
    initials = display_name.charAt(0)
 
    // eslint-disable-next-line
    if (isNaN(initials)) {
      return initials.toUpperCase()
    }
  }

  return initials
}

const propTypes = {
  size: PropTypes.number,
  user: PropTypes.object.isRequired
}

const defaultProps = {
  size: 48
}

const Avatar = ({ user, size }) => {
  const { profile_image_url } = user
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    lineHeight: `${size}px`
  }

  if (profile_image_url) {
    style.background = 'transparent'

    return (
      <img
        alt="rechat avatar"
        src={profile_image_url}
        className="c-avatar__image"
      />
    )
  }

  return (
    <div className="c-avatar" style={style}>
      {getNameInitials(user)}
    </div>
  )
}

Avatar.propTypes = propTypes
Avatar.defaultProps = defaultProps

export default Avatar
