import { forwardRef } from 'react'

import { Divider, Tooltip, makeStyles, Typography } from '@material-ui/core'
import Slider from '@material-ui/core/Slider'
import { mdiPencil, mdiPauseCircleOutline, mdiPlayCircleOutline } from '@mdi/js'
import cn from 'classnames'

import IconButton from 'components/Button/IconButton'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getMarkerPosition, msToMinutesAndSeconds } from './helper'
import { IKeyframe } from './types'

const useStyles = makeStyles(
  theme => ({
    container: {
      paddingTop: theme.spacing(2),
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 0,
      left: 0,
      backgroundColor: theme.palette.common.white,
      height: 89,
      width: 'calc(100% + 1px - 17rem)',
      borderTop: `1px solid ${theme.palette.grey[200]}`,
      zIndex: 1
    },
    divider: {
      height: '30%',
      margin: theme.spacing(0, 2)
    },
    icon: {
      color: theme.palette.tertiary.main,
      '&:hover': {
        color: theme.palette.tertiary.light
      }
    },
    progressBar: {
      position: 'relative',
      width: '70%',
      height: 20
    },
    marker: {
      cursor: 'pointer',
      backgroundColor: theme.palette.grey[300],
      height: 20,
      textAlign: 'center',
      borderRadius: theme.spacing(0.5),
      position: 'absolute',
      top: -25,
      width: 20,
      zIndex: 2,
      transition: '.4s top ease',
      transform: 'translateX(calc(-50% + 1px))',
      '& > $markerNumber': {
        display: 'inline-block'
      },
      '& > $markerEditIcon': {
        display: 'none'
      },
      '&:hover': {
        top: -28,
        backgroundColor: theme.palette.tertiary.main,
        transition: '.4s top ease',
        '&:after': {
          borderTopColor: theme.palette.tertiary.main
        },
        '&:before': {
          height: 28,
          transition: '.4s height ease'
        },
        '& > $markerNumber': {
          display: 'none'
        },
        '& > $markerEditIcon': {
          display: 'inline-block'
        }
      },
      '&:before': {
        content: "''",
        position: 'absolute',
        transform: 'translate(-50%, 100%)',
        left: '50%',
        bottom: 0,
        zIndex: -1,
        width: 2,
        height: 25,
        backgroundColor: 'inherit',
        transition: '.4s height ease'
      },
      '&:after': {
        content: "''",
        position: 'absolute',
        transform: 'translateY(-50%)',
        left: -2,
        bottom: -11,
        zIndex: -1,
        clipPath: 'circle(67% at 50% 97%)',
        border: 'solid 12px transparent',
        borderBottomWidth: 0,
        borderTopWidth: 10,
        borderTopColor: theme.palette.grey[300]
      }
    },
    activeMarker: {
      top: -28,
      backgroundColor: theme.palette.primary.main,
      '&:after': {
        borderTopColor: theme.palette.primary.main
      },
      '&:before': {
        height: 28
      }
    },
    markerNumber: {
      color: theme.palette.common.white,
      fontSize: 14,
      verticalAlign: 'top',
      userSelect: 'none'
    },
    markerEditIcon: { color: theme.palette.common.white, fontSize: 14 },
    time: {
      color: theme.palette.tertiary.main,
      marginLeft: theme.spacing(1),
      minWidth: 90
    },
    sliderRoot: {
      position: 'relative',
      zIndex: 3,
      overflow: 'hidden',
      borderRadius: theme.spacing(0.5),
      padding: 0,
      height: 20
    },
    sliderRail: {
      backgroundColor: theme.palette.grey[100],
      height: 20
    },
    sliderTrack: {
      backgroundColor: theme.palette.tertiary.main,
      height: 20
    },
    sliderThumb: {
      display: 'none'
    }
  }),
  { name: 'VideoTimeline' }
)

interface Props {
  currentTime: number
  duration: number
  isPlaying: boolean
  onSeek: (frame: number) => void
  onGoTo: (time: number) => void
  onPlay: () => void
  onPause: () => void
  keyframes: IKeyframe[]
}

export const VideoTimeline = forwardRef<HTMLDivElement, Props>(
  (
    {
      currentTime,
      duration,
      isPlaying,
      keyframes,
      onSeek,
      onGoTo,
      onPlay,
      onPause
    },
    ref
  ) => {
    const classes = useStyles()
    const isFinished = currentTime === duration

    const onClickPlayPauseButton = () => {
      // Replay if it reaches the end
      if (isFinished) {
        onSeek(0)
        onPlay()

        return
      }

      if (isPlaying) {
        onPause()
      } else {
        onPlay()
      }
    }

    const onMarkerClick = (index: number) => {
      onSeek(index)
    }

    const onMarkerDoubleClick = (index: number) => {
      onSeek(index)
      onPlay()
    }

    const handleChange = (event: any, newValue: number | number[]) => {
      onGoTo(newValue as number)
    }

    return (
      <div className={classes.container} ref={ref}>
        <Tooltip title={isPlaying ? 'Pause' : isFinished ? 'Replay' : 'Play'}>
          <IconButton
            iconSize="large"
            isFit
            className={classes.icon}
            onClick={onClickPlayPauseButton}
          >
            <SvgIcon
              path={isPlaying ? mdiPauseCircleOutline : mdiPlayCircleOutline}
            />
          </IconButton>
        </Tooltip>

        <Divider className={classes.divider} orientation="vertical" />

        <div className={classes.progressBar}>
          {keyframes.map((_, index) => (
            <div
              className={cn(
                classes.marker,
                currentTime === keyframes[index].at && classes.activeMarker
              )}
              style={{
                left: getMarkerPosition(index, keyframes, duration)
              }}
              key={index}
              onDoubleClick={() => {
                onMarkerDoubleClick(index)
              }}
              onClick={() => {
                onMarkerClick(index)
              }}
            >
              <span className={classes.markerNumber}>{index + 1}</span>
              <span className={classes.markerEditIcon}>
                <SvgIcon path={mdiPencil} size={muiIconSizes.small} />
              </span>
            </div>
          ))}

          <Slider
            classes={{
              root: classes.sliderRoot,
              track: classes.sliderTrack,
              rail: classes.sliderRail,
              thumb: classes.sliderThumb
            }}
            color="secondary"
            value={currentTime}
            min={0}
            max={duration}
            onChange={handleChange}
            aria-labelledby="video-slider"
          />
        </div>
        <Typography className={classes.time} variant="subtitle2">
          {`${msToMinutesAndSeconds(currentTime)} / ${msToMinutesAndSeconds(
            duration
          )}`}
        </Typography>
      </div>
    )
  }
)
