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

import { getContactSource } from 'models/contacts/helpers'
import { grey } from 'views/utils/colors'

import Avatar from 'components/Avatar'
import MiniContact from 'components/MiniContact'

import Dismiss from './Dismiss'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      '&:hover': {
        '& $setAsMasterButton': {
          visibility: 'visible'
        }
      }
    },
    listItemContainer: {
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
    },
    setAsMasterButton: {
      visibility: 'hidden'
    },
    contactSource: {
      color: grey.A900
    },
    masterText: {
      color: theme.palette.success.main
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
    <ListItem key={contact.id} className={classes.listItem} button>
      <div className={classes.listItemContainer}>
        <MiniContact type="contact" data={contact}>
          <div className={classes.row}>
            <Avatar
              image={contact.profile_image_url}
              style={{ marginRight: '0.5rem' }}
              title={contact.display_name}
            />
            <div className={classes.column}>
              <Typography variant="subtitle1">
                {contact.display_name}
              </Typography>
              <Typography className={classes.contactSource} variant="caption">
                {getContactSource(contact)} at{' '}
                {fecha.format(contact.created_at * 1000, 'MMMM D, YYYY')}
              </Typography>
            </div>
          </div>
        </MiniContact>
        <div>
          {isMaster && (
            <Typography variant="button" className={classes.masterText}>
              Master
            </Typography>
          )}
          {!isMaster && (
            <>
              <Button
                onClick={handleSetAsMaster}
                variant="text"
                color="primary"
                className={classes.setAsMasterButton}
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
