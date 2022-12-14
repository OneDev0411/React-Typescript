import React from 'react'

import { makeStyles, Theme } from '@material-ui/core'

import { Actions } from './Actions'
import Catalog from './Catalog/Catalog'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      alignItems: 'flex-start',
      padding: theme.spacing(2, 0),
      gap: theme.spacing(3)
    },
    catalogContainer: {
      flex: '1 1'
    },
    actionsContainer: {
      width: 'min-content',
      display: 'flex',
      height: 'auto',
      alignItems: 'center'
    }
  }),
  { name: 'ContactProfileHeader' }
)

export interface Props {
  contact: INormalizedContact
  contactChangeCallback: () => void
  onUpdateTouchFreq(newValue: Nullable<number>): void
}

export const Header = ({
  contact,
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
        <Actions contact={contact} onUpdateTouchFreq={onUpdateTouchFreq} />
      </div>
    </div>
  )
}
