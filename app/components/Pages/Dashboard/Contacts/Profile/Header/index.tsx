import React from 'react'

import { makeStyles, Theme } from '@material-ui/core'

import { Actions } from './Actions'
import Catalog from './Catalog/Catalog'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      padding: theme.spacing(3.5, 0, 1),
      gap: theme.spacing(3)
    },
    catalogContainer: {
      flex: '1 1 auto'
    },
    actionsContainer: {
      width: 'min-content',
      display: 'flex',
      height: 'auto',
      alignItems: 'start'
    }
  }),
  { name: 'ContactProfileHeader' }
)

export interface Props {
  contact: INormalizedContact
  contactChangeCallback: () => void
  onCreateEvent: () => void
  onCreateNote: (contact: INormalizedContact) => void
  onUpdateTouchFreq(newValue: Nullable<number>): void
}

export const Header = ({
  contact,
  onCreateNote,
  onCreateEvent,
  contactChangeCallback,
  onUpdateTouchFreq
}: Props) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.catalogContainer}>
        <Catalog
          contact={contact}
          contactChangeCallback={contactChangeCallback}
        />
      </div>
      <div className={classes.actionsContainer}>
        <Actions
          contact={contact}
          onCreateNote={onCreateNote}
          onCreateEvent={onCreateEvent}
          onUpdateTouchFreq={onUpdateTouchFreq}
        />
      </div>
    </div>
  )
}
