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
      fontSize: '17px',
      fontWeight: 600,
      color: '#62778c',
      marginBottom: '10px'
    },
    description: {
      fontSize: '14px',
      fontWeight: 500,
      color: '#8da2b5',
      marginBottom: '20px'
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
