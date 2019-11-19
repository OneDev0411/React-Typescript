import React from 'react'

import { Image } from './types'
import { Thumbnail as StyledThumbnail } from './styled'

interface Props {
  image: Image
  onClick: (image: Image) => void
}

export default function Thumbnail({ image, onClick }: Props) {
  return (
    <StyledThumbnail
      alt="thumbnail"
      src={image.thumbnail}
      onClick={() => onClick(image)}
    />
  )
}
