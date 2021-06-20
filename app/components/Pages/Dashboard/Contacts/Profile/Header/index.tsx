import React from 'react'
import { Box, makeStyles, Theme } from '@material-ui/core'

import { Actions } from './Actions'
import Catalog from './Catalog/Catalog'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(3.5, 0, 1)
    }
  }),
  { name: 'ContactProfileHeader' }
)

export interface Props {
  contact: INormalizedContact
  onTagChange: () => void
  handleCreateNote: (contact: IContact) => void
}

export const Header = ({ contact, onTagChange, handleCreateNote }: Props) => {
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      <Catalog contact={contact} onTagChange={onTagChange} />
      <Actions contact={contact} handleCreateNote={handleCreateNote} />
    </Box>
  )
}
