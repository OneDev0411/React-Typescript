import React, { useMemo } from 'react'
import { Box, Theme, makeStyles } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { EVENT_ICONS } from './icons'

const DEFAULT_ICON = EVENT_ICONS[EVENT_ICONS.length - 1]

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: theme.spacing(5),
      height: theme.spacing(5),
      borderRadius: '100%',
      background: theme.palette.grey[200]
    }
  }),
  { name: 'StepTypeIcon' }
)

interface Props {
  type: TTaskType
}

export const StepTypeIcon = ({ type }: Props) => {
  const classes = useStyles()

  const icon = useMemo(
    () => EVENT_ICONS.find(item => item.type === type) || DEFAULT_ICON,
    [type]
  )

  return (
    <Box className={classes.container}>
      <SvgIcon path={icon.icon} color="#000" />
    </Box>
  )
}
