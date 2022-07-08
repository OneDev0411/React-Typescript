import { forwardRef } from 'react'

import {
  Divider,
  Tooltip,
  makeStyles,
  Typography,
  alpha
} from '@material-ui/core'
import { mdiPauseCircleOutline, mdiPlayCircleOutline } from '@mdi/js'
import cn from 'classnames'

import IconButton from 'components/Button/IconButton'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getSlotProgress, getSlotWidth, msToMinutesAndSeconds } from './helper'
import { IKeyframe } from './types'

const useStyles = makeStyles(
  theme => ({
    container: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 0,
      left: 0,
      backgroundColor: theme.palette.common.white,
      height: 65,
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
      width: '70%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    progressSlot: {
      cursor: 'pointer',
      margin: theme.spacing(0, 0.25),
      backgroundColor: theme.palette.grey[100],
      height: 20,
      borderRadius: theme.spacing(0.5),
      position: 'relative',
      transition: '0.3s all ease-out',
      '&:hover': {
        transition: '0.3s all ease-in',
        backgroundColor: alpha(theme.palette.tertiary.main, 0.2),
        height: 24,
        boxShadow:
          '0px 0.5px 1px rgba(0, 0, 0, 0.05), 0px 4px 8px rgba(0, 0, 0, 0.1)'
      },
      '&:after': {
        content: 'attr(data-number)',
        paddingLeft: theme.spacing(0.5),
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left: 0,
        zIndex: 1,
        color: theme.palette.grey[400],
        fontSize: theme.typography.caption.fontSize
      }
    },
    activeProgressSlot: {
      backgroundColor: alpha(theme.palette.tertiary.main, 0.2),
      '&:after': {
        color: theme.palette.tertiary.contrastText
      }
    },
    innerProgress: {
      height: '100%',
      borderRadius: theme.spacing(0.5),
      backgroundColor: theme.palette.tertiary.main
    },
    time: {
      color: theme.palette.tertiary.main,
      marginLeft: theme.spacing(1),
      minWidth: 90
    }
  }),
  { name: 'VideoControls' }
)

interface Props {
  activeFrame: number
  currentTime: number
  duration: number
  isPlaying: boolean
  onSeek: (time: number) => void
  onPlay: () => void
  onPause: () => void
  keyframes: IKeyframe[]
}

export const VideoControls = forwardRef<HTMLDivElement, Props>(
  (
    {
      activeFrame,
      currentTime,
      duration,
      isPlaying,
      keyframes,
      onSeek,
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

    const onSlotClick = (index: number) => {
      onSeek(index)
    }

    const onSlotDoubleClick = (index: number) => {
      onSeek(index)
      onPlay()
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
                classes.progressSlot,
                currentTime >= keyframes[index].at && classes.activeProgressSlot
              )}
              style={{
                width: `${getSlotWidth(index, keyframes, duration).toFixed(2)}%`
              }}
              data-number={index + 1}
              key={index}
              onDoubleClick={() => {
                onSlotDoubleClick(index)
              }}
              onClick={() => {
                onSlotClick(index)
              }}
            >
              {getSlotProgress(index, keyframes, currentTime, duration) > 0 && (
                <div
                  style={{
                    width: `${getSlotProgress(
                      index,
                      keyframes,
                      currentTime,
                      duration
                    ).toFixed(2)}%`
                  }}
                  className={classes.innerProgress}
                />
              )}
            </div>
          ))}
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
