import React from 'react'
import { Box } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'

const useStyles = makeStyles(() =>
  createStyles({
    box: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      margin: '20vh auto 0',
      maxWidth: '33rem',
      textAlign: 'center'
    }
  })
)

export default function EmptyState() {
  const classes = useStyles()

  return (
    <Box className={classes.box}>
      <img src="/static/images/notifications/empty.svg" alt="Houston" />
      <h2>No notices right now!</h2>
      <p>We’ll let you know when we’ve got something new for you.</p>
    </Box>
  )
}
