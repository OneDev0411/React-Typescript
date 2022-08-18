import { HTMLAttributes, MouseEvent, FocusEvent } from 'react'

import { makeStyles } from '@material-ui/core'
import { mdiPlay } from '@mdi/js'
import cn from 'classnames'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    indicatorIcon: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1),
      color: theme.palette.common.white,
      filter: `drop-shadow(0px 0px 3px ${theme.palette.grey[700]})`,
      zIndex: 3,
      '& > path': {
        stroke: 'currentColor',
        strokeLinejoin: 'round',
        strokeWidth: 2
      }
    },
    indicatorIconCenter: {
      right: '50%',
      top: '50%',
      transform: 'translate(50%, -50%)'
    }
  }),
  {
    name: 'VideoThumbnail'
  }
)

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
  shouldHideIndicator?: boolean
  indicatorSize?: keyof typeof muiIconSizes
  indicatorPosition?: 'top-right' | 'center'
}

export function VideoThumbnail({
  url,
  shouldHideIndicator = false,
  indicatorSize = 'medium',
  indicatorPosition = 'top-right',
  ...otherProps
}: Props) {
  const classes = useStyles()

  const handleMouseEnter = (
    event: MouseEvent<HTMLVideoElement> | FocusEvent<HTMLVideoElement>
  ) => {
    const video = event.currentTarget

    if (isPlaying(video)) {
      return
    }

    video.play()
  }

  const handleMouseOut = (
    event: MouseEvent<HTMLVideoElement> | FocusEvent<HTMLVideoElement>
  ) => {
    const video = event.currentTarget

    if (!isPlaying(video)) {
      return
    }

    event.currentTarget.currentTime = 0
    event.currentTarget.pause()
  }

  return (
    <>
      {!shouldHideIndicator && (
        <SvgIcon
          path={mdiPlay}
          className={cn(
            classes.indicatorIcon,
            indicatorPosition === 'center' && classes.indicatorIconCenter
          )}
          size={muiIconSizes[indicatorSize]}
        />
      )}
      <video
        muted
        loop
        onMouseOut={handleMouseOut}
        onMouseEnter={handleMouseEnter}
        onBlur={handleMouseOut}
        onFocus={handleMouseEnter}
        controls={false}
        {...otherProps}
      >
        <source src={url} />
      </video>
    </>
  )
}
