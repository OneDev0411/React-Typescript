import React from 'react'

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import { importantDateIcon } from 'components/SvgIcons/icons'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
      ...theme.typography.h6,
      color: theme.palette.grey[500]
    },
    icon: {
      marginBottom: theme.spacing(1),
      color: theme.palette.grey['500']
    }
  })
)

interface Props {
  rowsCount: number
}

export function EmptyState({ rowsCount }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      {rowsCount === 0 && (
        <>
          <SvgIcon
            path={importantDateIcon}
            className={classes.icon}
            size={muiIconSizes.xlarge}
          />
          <div className={classes.title}>No events</div>
        </>
      )}
    </div>
  )
}
