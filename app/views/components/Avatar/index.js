import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'

import { getNameInitials } from '../../..//utils/helpers'
import { Container, Image, Status } from './styled'

const propTypes = {
  showStatus: PropTypes.bool,
  isOnline: PropTypes.bool,
  size: PropTypes.number,
  title: PropTypes.string,
  image: PropTypes.string,
  borderRadius: PropTypes.number,
  placeHolderImage: PropTypes.string
}

const defaultProps = {
  size: 40,
  image: '',
  title: '*',
  placeHolderImage: '',
  borderRadius: 100,
  isOnline: false,
  showStatus: false
}

const Avatar = ({ image, placeHolderImage, title, isOnline, ...props }) => {
  const imageUrl = image || placeHolderImage

  const hasImage =
    imageUrl &&
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(
      imageUrl
    )

  return (
    <Container center hasImage={hasImage} {...props}>
      {hasImage ? (
        <Image alt="rechat avatar" src={imageUrl} />
      ) : (
        getNameInitials(title)
      )}
      {props.showStatus && <Status isOnline={isOnline} size={props.size} />}
    </Container>
  )
}

Avatar.propTypes = propTypes
Avatar.defaultProps = defaultProps

export default pure(Avatar)
