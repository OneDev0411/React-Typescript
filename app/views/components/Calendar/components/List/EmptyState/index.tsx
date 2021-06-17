import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

import { CircularProgress } from '@material-ui/core'

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
  isLoading: boolean
}

export function EmptyState({ rowsCount, isLoading }: Props) {
  const classes = useStyles()

  if (!isLoading && rowsCount > 0) {
    return null
  }

  return (
    <div className={classes.container}>
      {!isLoading && rowsCount === 0 && (
        <>
          <SvgIcon
            path={importantDateIcon}
            className={classes.icon}
            size={muiIconSizes.xlarge}
          />
          <div className={classes.title}>No events</div>
        </>
      )}

      {isLoading && <CircularProgress />}
    </div>
  )
}
