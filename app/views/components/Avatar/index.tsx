import React from 'react'
import pure from 'recompose/pure'

import { getNameInitials } from '../../../utils/helpers'
import { Container, Image, Status, Initials } from './styled'

interface AvatarProps {
  statusColor?: string
  showStatus?: boolean
  isOnline?: boolean
  size?: number
  title?: string
  image?: string
  borderRadius?: number
  placeHolderImage?: string
  initials?: string
  backgroundColor?: string
}

const Avatar: React.FunctionComponent<AvatarProps> = ({
  size = 40,
  image = '',
  title = '',
  placeHolderImage = '',
  borderRadius = 100,
  isOnline = false,
  showStatus = false,
  statusColor = '#35b863',
  backgroundColor,
  initials = ''
}) => {
  let imageSrc = ''

  if (image != null && image.length > 1) {
    imageSrc = image
  } else if (placeHolderImage && !title) {
    imageSrc = placeHolderImage
  }

  return (
    <Container
      center
      size={size}
      borderRadius={borderRadius}
      backgroundColor={backgroundColor}
    >
      {imageSrc ? (
        <Image alt="rechat avatar" src={imageSrc} />
      ) : (
        <Initials size={size}>{initials || getNameInitials(title)}</Initials>
      )}
      {showStatus && (
        <Status isOnline={isOnline} size={size} statusColor={statusColor} />
      )}
    </Container>
  )
}

export default pure(Avatar)
