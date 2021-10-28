import React from 'react'

import { makeStyles, Theme } from '@material-ui/core'

import { Actions } from './Actions'
import Catalog from './Catalog/Catalog'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'grid',
      gridTemplateAreas: 'catalog actions',
      gridTemplateColumns: '2fr 1fr',
      padding: theme.spacing(3.5, 0, 1)
    },
    catalogContainer: {
      gridArea: 'catalog',
      gridColumn: '1 / span 2'
    },
    actionsContainer: {
      gridArea: 'actions',
      gridColumn: '3 / span 1',
      gridRow: '1 / 1',

      display: 'flex',
      marginLeft: theme.spacing(1),
      height: 'auto',
      alignItems: 'center'
    }
  }),
  { name: 'ContactProfileHeader' }
)

export interface Props {
  contact: INormalizedContact
  onTagChange: () => void
  handleCreateNote: (contact: INormalizedContact) => void
}

export const Header = ({ contact, onTagChange, handleCreateNote }: Props) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.catalogContainer}>
        <Catalog contact={contact} onTagChange={onTagChange} />
      </div>
      <div className={classes.actionsContainer}>
        <Actions contact={contact} handleCreateNote={handleCreateNote} />
      </div>
    </div>
  )
}
