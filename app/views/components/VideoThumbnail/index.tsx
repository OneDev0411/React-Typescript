import { HTMLAttributes, MouseEvent } from 'react'

// Read more:
// https://stackoverflow.com/questions/36803176/how-to-prevent-the-play-request-was-interrupted-by-a-call-to-pause-error#:~:text=is%20it%20an%20error%2C%20or%20more%20of%20a%20notice%3F&text=It's%20an%20error%2C%20here%20is,a%20call%20to%20pause().&text=The%20simple%20fix%20for%20this,when%20to%20pause%20or%20play.
function isPlaying(video: HTMLVideoElement): boolean {
  return !!(
    video.currentTime > 0 &&
    !video.paused &&
    !video.ended &&
    video.readyState > video.HAVE_CURRENT_DATA
  )
}
interface Props extends HTMLAttributes<HTMLVideoElement> {
  url: string
}

export function VideoThumbnail({ url, ...otherProps }: Props) {
  const handleMouseEnter = (event: MouseEvent<HTMLVideoElement>) => {
    const video = event.currentTarget

    if (isPlaying(video)) {
      return
    }

    video.play()
  }

  const handleMouseOut = (event: MouseEvent<HTMLVideoElement>) => {
    const video = event.currentTarget

    if (!isPlaying(video)) {
      return
    }

    event.currentTarget.currentTime = 0
    event.currentTarget.pause()
  }

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <video
      muted
      loop
      onMouseOut={handleMouseOut}
      onMouseEnter={handleMouseEnter}
      controls={false}
      {...otherProps}
    >
      <source src={url} />
    </video>
  )
}
