import React from 'react'
import { Box } from '@material-ui/core'

import CreateNewOpenHouse from './CreateNewOpenHouse'

export default function EmptyState(props: {
  onOpenDrawer: (item: IDeal | ICompactListing) => void
}) {
  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      margin="20vh auto 0"
      maxWidth="38rem"
      textAlign="center"
    >
      <img src="/static/images/contacts/zero-state.svg" alt="Houston" />
      <h2>Oops! No open houses are scheduled… Yet.</h2>
      <p>
        Impress sellers with additional marketing exposure while attracting new
        buyers and adding contacts. Holding an open house has never been easier!
      </p>
      <CreateNewOpenHouse onOpenDrawer={props.onOpenDrawer} />
    </Box>
  )
}
