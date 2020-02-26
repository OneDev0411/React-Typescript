import React from 'react'
import { browserHistory } from 'react-router'
import { Button, makeStyles, createStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh'
    },
    title: {
      fontSize: theme.typography.h6.fontSize,
      fontWeight: 600,
      color: theme.palette.grey[600],
      marginBottom: theme.spacing(1)
    },
    description: {
      fontSize: theme.typography.subtitle1.fontSize,
      fontWeight: 500,
      color: theme.palette.grey[600],
      marginBottom: theme.spacing(2)
    }
  })
)

export default function EmptyState() {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.title}>You don’t have any deals yet</div>
      <div className={classes.description}>
        Get started by creating a new listing or making an offer.
      </div>

      <div>
        <Button
          variant="outlined"
          onClick={() => browserHistory.push('/dashboard/deals/create')}
        >
          Create New Deal
        </Button>
      </div>
    </div>
  )
}
