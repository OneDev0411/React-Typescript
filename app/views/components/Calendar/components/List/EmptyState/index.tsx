import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import IconTaskCritical from 'components/SvgIcons/TaskCritical/IconTaskCritical'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    },
    title: {
      ...theme.typography.h5,
      color: theme.palette.grey[500]
    },
    icon: {
      width: '40px !important',
      height: '40px !important',
      marginBottom: theme.spacing(1),
      fill: theme.palette.grey['500']
    }
  })
)

export function EmptyState() {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <IconTaskCritical className={classes.icon} />
      <div className={classes.title}>No events</div>
    </div>
  )
}
