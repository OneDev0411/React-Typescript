import { HTMLAttributes, MouseEvent } from 'react'

interface Props extends HTMLAttributes<HTMLVideoElement> {
  url: string
}

export function VideoThumbnail({ url, ...otherProps }: Props) {
  const handleMouseEnter = (event: MouseEvent<HTMLVideoElement>) => {
    event.currentTarget.play()
  }

  const handleMouseOut = (event: MouseEvent<HTMLVideoElement>) => {
    event.currentTarget.currentTime = 0
    event.currentTarget.pause()
  }

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <video
      {...otherProps}
      muted
      loop
      onMouseOut={handleMouseOut}
      onMouseEnter={handleMouseEnter}
      controls={false}
    >
      <source src={url} />
    </video>
  )
}
