import React from 'react'

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { importantDateIcon } from 'components/SvgIcons/icons'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      position: 'relative',
      flexDirection: 'column',
      height: '100%'
    },
    title: {
      ...theme.typography.h6,
      color: theme.palette.grey[500]
    },
    icon: {
      color: theme.palette.grey['500'],
      margin: `25% 25% ${theme.spacing(1)}px`
    },
    iconContainer: {
      position: 'absolute',
      top: '12.5%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  })
)

export function EmptyState() {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.iconContainer}>
        <SvgIcon
          path={importantDateIcon}
          className={classes.icon}
          size={muiIconSizes.xlarge}
        />
        <div className={classes.title}>No events</div>
      </div>
    </div>
  )
}
