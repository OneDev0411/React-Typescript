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
      overflow: 'hidden',
      '&:hover $title': {
        color: theme.palette.text.primary
      }
    },
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      minWidth: theme.spacing(15),
      gap: theme.spacing(1)
    },
    title: {
      color: theme.palette.grey[600]
    },
    value: {
      flex: '1 0 auto',
      display: 'inline-block',
      whiteSpace: 'nowrap',
      msTextOverflow: 'ellipsis',
      textOverflow: 'ellipsis',
      textAlign: 'right',
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
          {title}
        </Typography>

        {props.is_primary && (
          <Tooltip title="Primary">
            <SvgIcon
              path={mdiStarOutline}
              className={classes.starIcon}
              size={muiIconSizes.small}
            />
          </Tooltip>
        )}

        {props.isTriggerable && (
          <SvgIcon
            path={mdiLightningBoltOutline}
            className={classes.triggerIcon}
            size={muiIconSizes.small}
          />
        )}
      </Box>
      <Box className={classes.value}>
        <Typography variant="body2">{props.value || '-'}</Typography>
      </Box>
    </Box>
  )
}
