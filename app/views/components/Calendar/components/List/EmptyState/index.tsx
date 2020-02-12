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
      fontSize: '1.5rem',
      fontWeight: 500,
      marginTop: '1rem',
      color: theme.palette.grey.A400
    },
    icon: {
      width: '5rem',
      height: '5rem',
      fill: theme.palette.grey.A400
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
