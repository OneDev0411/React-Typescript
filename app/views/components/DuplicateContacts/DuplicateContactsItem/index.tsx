import React from 'react'
import {
  ListItem,
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Button,
  Avatar
} from '@material-ui/core'
import fecha from 'fecha'

import {
  getContactSource,
  getContactNameInitials
} from 'models/contacts/helpers'

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
      visibility: 'hidden',
      margin: theme.spacing(0, 0.5)
    },
    contactSource: {
      color: theme.palette.grey['500']
    },
    masterText: {
      color: theme.palette.success.main
    },
    avatar: {
      marginRight: theme.spacing(1),
      backgroundColor: theme.palette.divider,
      color: theme.palette.text.primary
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
  const avatarUrl =
    contact && contact.profile_image_url ? contact.profile_image_url : ''
  const displayName =
    contact && contact.display_name ? contact.display_name : ''

  return (
    <ListItem key={contact.id} className={classes.listItem} button>
      <div className={classes.listItemContainer}>
        <MiniContact type="contact" data={contact}>
          <div className={classes.row}>
            <Avatar
              className={classes.avatar}
              alt={displayName}
              src={avatarUrl}
            >
              {getContactNameInitials(contact)}
            </Avatar>
            <div className={classes.column}>
              <Typography variant="body2">{displayName}</Typography>
              <Typography className={classes.contactSource} variant="body2">
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
