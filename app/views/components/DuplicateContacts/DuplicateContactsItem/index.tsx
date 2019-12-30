import React from 'react'
import {
  ListItem,
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Button
} from '@material-ui/core'
import fecha from 'fecha'

import Avatar from 'components/Avatar'
import MiniContact from 'components/MiniContact'

import Dismiss from './Dismiss'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    row: {
      display: 'flex',
      flexDirection: 'row'
    },
    column: {
      display: 'flex',
      flexDirection: 'column'
    }
  })
)

interface Props {
  contact: IContact
  isMaster: boolean
  onDismissClick: (contactId: UUID) => void
  onSetMasterClick: (contactId: UUID) => void
}

export default function DuplicateContactsListItem({
  contact,
  isMaster,
  onDismissClick,
  onSetMasterClick
}: Props) {
  const classes = useStyles()

  const handleDismiss = () => {
    onDismissClick(contact.id)
  }

  const handleSetAsMaster = () => {
    onSetMasterClick(contact.id)
  }

  return (
    <ListItem key={contact.id} button>
      <div className={classes.listContainer}>
        <MiniContact type="contact" data={contact}>
          <div className={classes.row}>
            <Avatar
              image={contact.profile_image_url}
              style={{ marginRight: '0.5rem' }}
            />
            <div className={classes.column}>
              <Typography variant="body1">{contact.display_name}</Typography>
              <Typography variant="caption">
                Created at{' '}
                {fecha.format(contact.created_at * 1000, 'MMMM D, YYYY')}
              </Typography>
            </div>
          </div>
        </MiniContact>
        <div>
          {isMaster && (
            <Typography variant="button" color="primary">
              Master
            </Typography>
          )}
          {!isMaster && (
            <>
              <Button
                onClick={handleSetAsMaster}
                variant="text"
                color="primary"
              >
                Set As Master
              </Button>
              <Dismiss onClick={handleDismiss} />
            </>
          )}
        </div>
      </div>
    </ListItem>
  )
}
