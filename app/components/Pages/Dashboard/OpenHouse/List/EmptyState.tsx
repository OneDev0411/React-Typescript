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

import CreateNewOpenHouse from './CreateNewOpenHouse'

export default function EmptyState(props: {
  onOpenDrawer: (item: IDeal | ICompactListing) => void
}) {
  const classes = useStyles()

  return (
    <Box className={classes.box}>
      <img src="/static/images/contacts/zero-state.svg" alt="Houston" />
      <h2>No open houses are scheduled… Yet!</h2>
      <p>
        Impress sellers with additional marketing exposure while attracting new
        buyers and adding contacts. Holding an open house has never been easier!
      </p>
      <CreateNewOpenHouse onOpenDrawer={props.onOpenDrawer} />
    </Box>
  )
}
