import React from 'react'
import { Box } from '@material-ui/core'

import CreateNewTour from './CreateNewTour'

export default function EmptyState(props: { onOpenDrawer: () => void }) {
  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      margin="20vh auto 0"
      maxWidth="33rem"
      textAlign="center"
    >
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
