import React from 'react'
import {
  Box,
  Tooltip,
  Typography,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'
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
    contentContainer: {
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
    triggerIcon: (props: Props) => ({
      color: !props.isTriggerActive
        ? theme.palette.grey[500]
        : theme.palette.warning.main
    }),
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
        <Typography variant="body2" className={classes.value}>
          {props.value || '-'}
        </Typography>
        {props.isTriggerable && (
          <SvgIcon
            path={mdiLightningBoltOutline}
            leftMargined
            className={classes.triggerIcon}
            size={muiIconSizes.small}
          />
        )}
      </Box>
    </Box>
  )
}
