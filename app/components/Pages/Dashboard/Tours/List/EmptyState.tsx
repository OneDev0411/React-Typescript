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

import CreateNewTour from './CreateNewTour'

export default function EmptyState(props: { onOpenDrawer: () => void }) {
  const classes = useStyles()

  return (
    <Box className={classes.box}>
      <img src="/static/images/contacts/zero-state.svg" alt="Houston" />
      <h2>No toursheets are scheduled… Yet!</h2>
      <p>
        Impress sellers with additional marketing exposure while attracting new
        buyers and adding contacts. Holding a tour has never been easier!
      </p>
      <CreateNewTour onOpenDrawer={props.onOpenDrawer} />
    </Box>
  )
}
