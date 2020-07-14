import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { importantDateIcon } from 'components/SvgIcons/icons'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

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
      marginBottom: theme.spacing(1),
      color: theme.palette.grey['500']
    }
  })
)

export function EmptyState() {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <SvgIcon
        path={importantDateIcon}
        className={classes.icon}
        size={muiIconSizes.xlarge}
      />
      <div className={classes.title}>No events</div>
    </div>
  )
}
