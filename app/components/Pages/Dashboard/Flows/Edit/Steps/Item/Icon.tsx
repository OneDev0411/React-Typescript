import React from 'react'
import { Box, fade, Theme, makeStyles } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

// TODO: merge all events icon into one specific file
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import { EVENT_ICONS } from './icons'

const DEFAULT_ICON = EVENT_ICONS[EVENT_ICONS.length - 1]

const useStyles = makeStyles<Theme, { color: string; hasBackground: boolean }>(
  theme => ({
    container: props => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: theme.spacing(4),
      height: theme.spacing(4),
      borderRadius: '100%',
      marginRight: theme.spacing(2),
      backgroundColor: props.hasBackground
        ? fade(props.color, 0.2)
        : 'transparent'
    })
  })
)

interface Props {
  type: TTaskType
  hasBackground?: boolean
}

export default function Icon({ type, hasBackground = true }: Props) {
  const icon = EVENT_ICONS.find(item => item.type === type) || DEFAULT_ICON
  const classes = useStyles({ hasBackground, color: icon.color })

  return (
    <Box className={classes.container}>
      <SvgIcon path={icon.icon} color={icon.color} size={muiIconSizes.small} />
    </Box>
  )
}
