import React from 'react'
import pure from 'recompose/pure'
import { CSSProperties } from '@material-ui/styles'

import { getNameInitials } from '../../../utils/helpers'
import { Container, Image, Status, Initials } from './styled'

export interface AvatarProps {
  statusColor?: string
  showStatus?: boolean
  isOnline?: boolean
  size?: number
  title?: string
  image?: string | null
  borderRadius?: number
  placeHolderImage?: string
  initials?: string
  backgroundColor?: string
  style?: CSSProperties
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
  initials = '',
  style
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
      style={style}
      title={title}
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
