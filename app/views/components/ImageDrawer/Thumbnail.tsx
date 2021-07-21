import React from 'react'

import { Thumbnail as StyledThumbnail } from './styled'
import { Image } from './types'

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
