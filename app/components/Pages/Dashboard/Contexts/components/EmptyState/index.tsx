import React from 'react'
import { Box, Button } from '@material-ui/core'
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

export default function EmptyState(props: { onOpenNewContext: () => void }) {
  const classes = useStyles()

  return (
    <Box className={classes.box}>
      <img src="/static/images/contacts/zero-state.svg" alt="Houston" />
      <h2>No deal context… Yet!</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={props.onOpenNewContext}
      >
        Create New Context
      </Button>
    </Box>
  )
}
