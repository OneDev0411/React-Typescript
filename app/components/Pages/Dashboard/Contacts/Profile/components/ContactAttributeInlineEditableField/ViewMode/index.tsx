import React from 'react'
import { Box, Tooltip, Typography, makeStyles, Theme } from '@material-ui/core'
import { mdiStarOutline, mdiLightningBoltOutline } from '@mdi/js'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  is_primary?: boolean
  title?: string
  value?: string
  isTriggerable: boolean
  isTriggerActive: boolean
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      '&:hover $title': {
        color: theme.palette.text.primary
      }
    },
    contentContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    triggerIndicator: {
      width: theme.spacing(2),
      height: theme.spacing(2)
    },
    title: (props: Props) => ({
      color: props.value ? theme.palette.text.primary : theme.palette.grey[500],
      wordBreak: 'break-word'
    }),
    starIcon: {
      color: theme.palette.text.primary
    },
    triggerIcon: (props: Props) => ({
      color: props.isTriggerActive
        ? theme.palette.warning.main
        : theme.palette.grey[500]
    }),
    value: {
      minWidth: theme.spacing(10.5),
      textAlign: 'right',
      color: theme.palette.grey[500]
    }
  }),
  { name: 'InlineEditFieldViewMode' }
)

export function ViewMode(props: Props) {
  const classes = useStyles(props)
  const { title } = props

  return (
    <Box className={classes.container}>
      <Box className={classes.contentContainer}>
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
              path={mdiStarOutline}
              leftMargined
              className={classes.starIcon}
              size={muiIconSizes.small}
            />
          </Tooltip>
        )}
      </Box>
      <Box className={classes.contentContainer}>
        <Box className={classes.value}>
          <Typography variant="body2">{props.value || '-'}</Typography>
        </Box>

        {props.isTriggerable && (
          <Box>
            <SvgIcon
              path={mdiLightningBoltOutline}
              leftMargined
              className={classes.triggerIcon}
              size={muiIconSizes.small}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}
