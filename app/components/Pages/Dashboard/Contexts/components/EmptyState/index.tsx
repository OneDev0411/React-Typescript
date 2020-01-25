import React from 'react'
import { Box, Button } from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      maxWidth: '33rem',
      textAlign: 'center'
    }
  })
)

interface Props {
  onOpenNewContext: () => void
}

export default function EmptyState({ onOpenNewContext }: Props) {
  const classes = useStyles()

  return (
    <Box mt={16} mx="auto" className={classes.box}>
      <img src="/static/images/contacts/zero-state.svg" alt="Houston" />
      <h2>No deal context… Yet!</h2>
      <Button variant="contained" color="primary" onClick={onOpenNewContext}>
        Create New Context
      </Button>
    </Box>
  )
}
