import React from 'react'
import { Box, Tooltip, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import StarIcon from 'components/SvgIcons/Star/StarIcon'

interface Props {
  is_primary?: boolean
  title?: string
  value?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      '&:hover $starIcon': {
        visibility: 'visible'
      },
      '&:hover $title': {
        color: theme.palette.text.primary
      }
    },
    leftSide: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: (props: Props) => ({
      color: props.value ? theme.palette.text.primary : theme.palette.text.hint
    }),
    starIcon: {
      marginLeft: theme.spacing(1),
      fill: theme.palette.text.primary,
      visibility: 'hidden'
    },
    value: (props: Props) => ({
      textAlign: 'right',
      color: props.value ? theme.palette.text.primary : theme.palette.text.hint
    })
  })
)

export function ViewMode(props: Props) {
  const classes = useStyles(props)
  const { title } = props

  return (
    <Box className={classes.container}>
      <Box className={classes.leftSide}>
        <Typography
          variant="body1"
          className={classes.title}
          data-test={`contact-attribute${title ? `-${title}` : ''}`}
        >
          {title}
        </Typography>
        {props.is_primary && (
          <Tooltip title="Primary">
            <StarIcon
              className={classes.starIcon}
              style={{
                width: '1rem',
                height: '1rem'
              }}
            />
          </Tooltip>
        )}
      </Box>
      <Typography className={classes.value}>{props.value || '-'}</Typography>
    </Box>
  )
}
