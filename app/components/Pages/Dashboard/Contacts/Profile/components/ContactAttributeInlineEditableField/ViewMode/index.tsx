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
      flexDirection: 'row',
      padding: theme.spacing(0, 1),
      '&:hover $title': {
        color: theme.palette.text.primary
      }
    },
    titleContainer: {
      width: '100%'
    },
    title: {
      width: '100%',
      color: theme.palette.grey[600]
    },
    value: {
      display: 'inline-block',
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textAlign: 'right',
      msTextOverflow: 'ellipsis',
      textOverflow: 'ellipsis',
      color: theme.palette.grey[900]
    },
    triggerIndicator: {
      width: theme.spacing(2),
      height: theme.spacing(2)
    },
    starIcon: {
      color: theme.palette.warning.main,
      verticalAlign: 'middle'
    },
    triggerIcon: (props: Props) => ({
      color: props.isTriggerActive
        ? theme.palette.warning.main
        : theme.palette.grey[500],
      verticalAlign: 'middle'
    })
  }),
  { name: 'InlineEditFieldViewMode' }
)

export function ViewMode(props: Props) {
  const classes = useStyles(props)
  const { title } = props

  return (
    <Box className={classes.container}>
      <Box className={classes.titleContainer}>
        <Typography
          variant="body2"
          className={classes.title}
          data-test={`contact-attribute${title ? `-${title}` : ''}`}
        >
          <span>{title}</span>
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
          {props.isTriggerable && (
            <SvgIcon
              path={mdiLightningBoltOutline}
              leftMargined
              className={classes.triggerIcon}
              size={muiIconSizes.small}
            />
          )}
        </Typography>
      </Box>
      <Box className={classes.value}>
        <Typography variant="body2">{props.value || '-'}</Typography>
      </Box>
    </Box>
  )
}
