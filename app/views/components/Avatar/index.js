import React from 'react'
import PropTypes from 'prop-types'
import pure from 'recompose/pure'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import { getNameInitials } from '../../..//utils/helpers'

const Container = Flex.extend`
  height: ${props => `${props.size / 16}em}`};
  width: ${props => `${props.size / 16}em}`};
  color: #fff;
  border-radius: ${props => `${props.borderRadius}%`};
  background: ${props => (props.hasImage ? 'transparent' : '#000')};
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: inherit;

  &[alt] {
    font-size: 0;
  }
`

const propTypes = {
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
  borderRadius: 100
}

const Avatar = ({ image, placeHolderImage, title, ...props }) => {
  const hasImage = image || placeHolderImage

  return (
    <Container center hasImage={hasImage} {...props}>
      {hasImage ? (
        <Image alt="rechat avatar" src={image || placeHolderImage} />
      ) : (
        getNameInitials(title)
      )}
    </Container>
  )
}

Avatar.propTypes = propTypes
Avatar.defaultProps = defaultProps

export default pure(Avatar)
