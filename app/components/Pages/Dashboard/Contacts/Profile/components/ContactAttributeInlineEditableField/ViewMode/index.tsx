import React from 'react'
import { Box, Tooltip, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { mdiStar } from '@mdi/js'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
      color: theme.palette.text.primary
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
          variant="body2"
          className={classes.title}
          data-test={`contact-attribute${title ? `-${title}` : ''}`}
        >
          {title}
        </Typography>
        {props.is_primary && (
          <Tooltip title="Primary">
            <SvgIcon
              path={mdiStar}
              leftMargined
              className={classes.starIcon}
              size={muiIconSizes.small}
            />
          </Tooltip>
        )}
      </Box>
      <Typography variant="body2" className={classes.value}>
        {props.value || '-'}
      </Typography>
    </Box>
  )
}
