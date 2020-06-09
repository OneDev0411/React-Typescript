import React from 'react'
import { Box, Button, useMediaQuery } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import IconVideo from 'components/SvgIcons/VideoFilled/IconVideoFilled'

interface StylesProps {
  isDesktop: boolean
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    jumbo: {
      fontSize: '2rem',
      maxWidth: '568px',
      margin: `0 0 ${theme.spacing(4)}px`,
      fontFamily: theme.typography.h1.fontFamily
    },
    coverImage: (props: StylesProps) => {
      if (props.isDesktop) {
        return {
          width: '979px',
          position: 'absolute',
          top: `${theme.spacing(2)}px`,
          right: `${theme.spacing(2)}px`
        }
      }

      return {
        maxWidth: '100%'
      }
    },
    videoIcon: {
      marginRight: '0.5em',
      fill: `${theme.palette.primary.main}`
    }
  })
)

export default function EmptyState() {
  const isDesktop = useMediaQuery('(min-width:1440px)')
  const classes = useStyles({ isDesktop })
  const getCoverSrc = (rate: number) =>
    `/static/images/marketing/my-designs/empty-state${
      rate > 0 ? `@${rate}x` : ''
    }.png`

  return (
    <Box display="flex" flexDirection="column" p={7} position="relative">
      <h1 className={classes.jumbo}>
        Impress your clients with stunning designs using ready-made social &
        email templates
      </h1>
      <div>
        <Button
          color="primary"
          target="blank"
          href="https://help.rechat.com/en/collections/1969137-marketing"
        >
          <IconVideo className={classes.videoIcon} />
          Learn More
        </Button>
      </div>
      <img
        alt="empty-state"
        className={classes.coverImage}
        srcSet={`
          ${getCoverSrc(0)} 1x,
          ${getCoverSrc(2)} 2x,
          ${getCoverSrc(3)} 3x
        `}
      />
    </Box>
  )
}
