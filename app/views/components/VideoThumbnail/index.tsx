import { memo } from 'react'

import VideoImageThumbnail from 'react-video-thumbnail-image'

interface Props {
  url: string
}

export const VideoThumbnail = memo(({ url }: Props) => {
  return <VideoImageThumbnail videoUrl={url} />
})
