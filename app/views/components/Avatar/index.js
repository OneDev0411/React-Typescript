import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'

import { getNameInitials } from '../../..//utils/helpers'

const propTypes = {
  size: PropTypes.number,
  title: PropTypes.string,
  image: PropTypes.string,
  borderRadius: PropTypes.number,
  placeHolderImage: PropTypes.string
}

const defaultProps = {
  size: 36,
  image: '',
  title: '*',
  borderRadius: 100,
  placeHolderImage: ''
}

const Avatar = ({ image, title, size, placeHolderImage, borderRadius }) => {
  const style = {
    width: size,
    height: size,
    lineHeight: `${size}px`,
    borderRadius
  }

  if (image || placeHolderImage) {
    style.background = 'transparent'

    return (
      <div className="c-avatar" style={style}>
        <img
          alt="rechat avatar"
          className="c-avatar__image"
          src={image || placeHolderImage}
        />
      </div>
    )
  }

  return (
    <div style={style} className="c-avatar">
      {getNameInitials(title)}
    </div>
  )
}

Avatar.propTypes = propTypes
Avatar.defaultProps = defaultProps

export default pure(Avatar)
